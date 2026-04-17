import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from models.pm25_predictor_lr import predict

PASS = 0
FAIL = 0

def run(label, fn):
    global PASS, FAIL
    try:
        fn()
        print(f"  PASS  {label}")
        PASS += 1
    except AssertionError as e:
        print(f"  FAIL  {label} -{e}")
        FAIL += 1
    except Exception as e:
        print(f"  ERROR {label} -{type(e).__name__}: {e}")
        FAIL += 1

def summary():
    total = PASS + FAIL
    print(f"\n{PASS}/{total} passed", "OK" if FAIL == 0 else "FAILED")

def base_predict(**overrides):
    """Baseline call with typical values; override any field via kwargs."""
    defaults = dict(pm25_outdoor=20.0, windspeed=3.0, aqi=95, temp_outdoor=32.0, humid=65)
    defaults.update(overrides)
    return predict(**defaults)


# ===========================================================================
print("\n-- Return type & basic sanity (LinearRegression) ------------------")
# ===========================================================================

def test_returns_float():
    assert isinstance(base_predict(), float)

def test_returns_positive():
    assert base_predict() > 0

def test_returns_reasonable_range():
    # Indoor PM2.5 in dataset spans ~4.3 - 26.6 ug/m3; allow buffer
    result = base_predict()
    assert 0 < result < 80, f"value {result:.2f} is outside plausible range"

run("returns a float (LR)",               test_returns_float)
run("result is positive (LR)",            test_returns_positive)
run("result is in plausible range (LR)",  test_returns_reasonable_range)


# ===========================================================================
print("\n-- Monotonicity: higher outdoor PM2.5 -> higher indoor PM2.5 (LR) --")
# ===========================================================================

def test_higher_outdoor_increases_prediction():
    low  = base_predict(pm25_outdoor=8.0)
    high = base_predict(pm25_outdoor=28.0)
    assert high > low, f"expected high({high:.2f}) > low({low:.2f})"

def test_monotonic_pm25_steps():
    values = [8.0, 13.0, 18.0, 23.0, 28.0]
    preds  = [base_predict(pm25_outdoor=v) for v in values]
    for i in range(len(preds) - 1):
        assert preds[i] <= preds[i+1] + 0.5, (
            f"non-monotonic at step {i}: "
            f"pm25={values[i]} -> {preds[i]:.2f}, "
            f"pm25={values[i+1]} -> {preds[i+1]:.2f}"
        )

run("higher outdoor PM2.5 gives higher prediction (LR)",  test_higher_outdoor_increases_prediction)
run("predictions increase across PM2.5 steps (LR)",       test_monotonic_pm25_steps)


# ===========================================================================
print("\n-- Windspeed effect (LinearRegression) --------------------------")
# ===========================================================================

def test_high_wind_not_much_lower_than_calm():
    calm  = base_predict(windspeed=1.0)
    windy = base_predict(windspeed=12.0)
    assert windy >= calm - 3.0, f"windy({windy:.2f}) too low vs calm({calm:.2f})"

def test_windspeed_zero_valid():
    assert base_predict(windspeed=0.0) > 0

run("high wind does not drastically lower prediction (LR)",  test_high_wind_not_much_lower_than_calm)
run("windspeed=0 still gives a valid prediction (LR)",       test_windspeed_zero_valid)


# ===========================================================================
print("\n-- AQI effect (LinearRegression) --------------------------------")
# ===========================================================================

def test_aqi_range_all_valid():
    for aqi_val in [50, 75, 100, 125, 150]:
        r = base_predict(aqi=aqi_val)
        assert 0 < r < 80, f"AQI={aqi_val} gave out-of-range result {r:.2f}"

run("AQI range produces valid predictions (LR)",  test_aqi_range_all_valid)


# Run summary
summary()
