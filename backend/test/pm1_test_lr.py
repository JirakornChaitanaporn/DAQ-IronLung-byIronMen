import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from models.pm1_predictor_lr import predict

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

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def base_predict(**overrides):
    """Baseline call with typical values; override any field via kwargs."""
    defaults = dict(pm1_outdoor=10.0, windspeed=3.0, aqi=95, temp_outdoor=32.0, humid=65)
    defaults.update(overrides)
    return predict(**defaults)


# ===========================================================================
print("\n-- Return type & basic sanity (LinearRegression) ------------------")
# ===========================================================================

def test_returns_float():
    result = base_predict()
    assert isinstance(result, float), f"expected float, got {type(result)}"

def test_returns_positive():
    result = base_predict()
    assert result > 0, f"expected positive value, got {result}"

def test_returns_reasonable_range():
    result = base_predict()
    assert 0 < result < 50, f"value {result:.2f} is outside plausible range"

run("returns a float (LR)",                  test_returns_float)
run("result is positive (LR)",               test_returns_positive)
run("result is in plausible range (LR)",     test_returns_reasonable_range)


# ===========================================================================
print("\n-- Monotonicity: higher outdoor PM1 -> higher indoor PM1 (LR) -----")
# ===========================================================================

def test_higher_outdoor_pm1_increases_prediction():
    low  = base_predict(pm1_outdoor=4.0)
    high = base_predict(pm1_outdoor=16.0)
    assert high > low, f"expected high({high:.2f}) > low({low:.2f})"

def test_monotonic_pm1_outdoor_steps():
    values = [4.0, 7.0, 10.0, 13.0, 16.0]
    preds  = [base_predict(pm1_outdoor=v) for v in values]
    for i in range(len(preds) - 1):
        assert preds[i] <= preds[i+1] + 0.5, (
            f"non-monotonic at step {i}: "
            f"pm1={values[i]} -> {preds[i]:.2f}, "
            f"pm1={values[i+1]} -> {preds[i+1]:.2f}"
        )

run("higher outdoor PM1 gives higher prediction (LR)",   test_higher_outdoor_pm1_increases_prediction)
run("predictions increase across PM1 steps (LR)",        test_monotonic_pm1_outdoor_steps)


# ===========================================================================
print("\n-- Windspeed effect (LinearRegression) --------------------------")
# ===========================================================================

def test_high_wind_not_lower_than_calm_by_large_margin():
    calm   = base_predict(windspeed=1.0)
    windy  = base_predict(windspeed=12.0)
    assert windy >= calm - 2.0, (
        f"windy({windy:.2f}) is suspiciously much lower than calm({calm:.2f})"
    )

def test_windspeed_zero_still_returns_value():
    result = base_predict(windspeed=0.0)
    assert result > 0

run("high wind does not drastically lower prediction (LR)",  test_high_wind_not_lower_than_calm_by_large_margin)
run("windspeed=0 still gives a valid prediction (LR)",       test_windspeed_zero_still_returns_value)


# ===========================================================================
print("\n-- AQI effect (LinearRegression) --------------------------------")
# ===========================================================================

def test_high_aqi_not_lower_than_low_aqi():
    low_aqi  = base_predict(aqi=50)
    high_aqi = base_predict(aqi=150)
    assert high_aqi >= low_aqi - 1.5, (
        f"high AQI({high_aqi:.2f}) unexpectedly much lower than low AQI({low_aqi:.2f})"
    )

def test_aqi_range_gives_valid_output():
    for aqi_val in [50, 75, 100, 125, 150]:
        r = base_predict(aqi=aqi_val)
        assert 0 < r < 50, f"AQI={aqi_val} gave out-of-range result {r:.2f}"

run("higher AQI does not sharply lower prediction (LR)",  test_high_aqi_not_lower_than_low_aqi)
run("all AQI values return valid outputs (LR)",           test_aqi_range_gives_valid_output)


# ===========================================================================
print("\n-- Temperature effect (LinearRegression) ----------------------")
# ===========================================================================

def test_extreme_temp_still_returns_valid():
    for temp in [20.0, 25.0, 30.0, 35.0, 40.0]:
        r = base_predict(temp_outdoor=temp)
        assert 0 < r < 50, f"temp={temp} gave out-of-range result {r:.2f}"

run("all outdoor temp values return valid outputs (LR)",  test_extreme_temp_still_returns_valid)


# ===========================================================================
print("\n-- Humidity effect (LinearRegression) ---------------------------")
# ===========================================================================

def test_humidity_range_gives_valid_output():
    for h in [30, 50, 65, 80, 95]:
        r = base_predict(humid=h)
        assert 0 < r < 50, f"humid={h} gave out-of-range result {r:.2f}"

run("all humidity values return valid outputs (LR)",  test_humidity_range_gives_valid_output)


# ===========================================================================
print("\n-- Scenario tests (realistic conditions) (LR) -------------------")
# ===========================================================================

scenarios = [
    ("clean day, low wind",        dict(pm1_outdoor=4.0,  windspeed=2.0, aqi=60,  temp_outdoor=29.0, humid=75)),
    ("typical Bangkok afternoon",  dict(pm1_outdoor=10.0, windspeed=3.5, aqi=95,  temp_outdoor=33.0, humid=62)),
    ("dusty, windy day",           dict(pm1_outdoor=16.0, windspeed=9.0, aqi=110, temp_outdoor=35.0, humid=50)),
    ("hot and humid, calm",        dict(pm1_outdoor=8.0,  windspeed=1.5, aqi=85,  temp_outdoor=36.0, humid=84)),
    ("cool night, moderate dust",  dict(pm1_outdoor=7.0,  windspeed=2.5, aqi=90,  temp_outdoor=27.0, humid=70)),
]

def make_scenario_test(kwargs):
    def fn():
        r = predict(**kwargs)
        assert 0 < r < 50, f"got {r:.2f}"
    return fn

for label, kwargs in scenarios:
    run(f"scenario: {label} (LR)", make_scenario_test(kwargs))


# ===========================================================================
print("\n-- Edge cases (LinearRegression) --------------------------------")
# ===========================================================================

def test_minimum_realistic_inputs():
    r = base_predict(pm1_outdoor=3.3, windspeed=0.0, aqi=50, temp_outdoor=25.0, humid=30)
    assert 0 < r < 50

def test_maximum_realistic_inputs():
    r = base_predict(pm1_outdoor=16.8, windspeed=12.0, aqi=150, temp_outdoor=40.0, humid=95)
    assert 0 < r < 50

def test_deterministic_same_input():
    r1 = base_predict(pm1_outdoor=10.0)
    r2 = base_predict(pm1_outdoor=10.0)
    assert r1 == r2, f"same input gave different results: {r1} vs {r2}"

def test_different_inputs_give_different_outputs():
    r1 = base_predict(pm1_outdoor=4.0)
    r2 = base_predict(pm1_outdoor=16.0)
    assert r1 != r2

run("minimum realistic inputs (LR)",             test_minimum_realistic_inputs)
run("maximum realistic inputs (LR)",             test_maximum_realistic_inputs)
run("same input always gives same output (LR)",  test_deterministic_same_input)
run("different inputs give different outputs (LR)", test_different_inputs_give_different_outputs)

# ===========================================================================
summary()
