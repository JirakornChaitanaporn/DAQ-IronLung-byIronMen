class Suggest:
    @classmethod
    def suggest(cls, indoor_aqi, outdoor_aqi):
        def calculate_risk(data):
            # Index mapping: 0 = pm1, 1 = pm10, 2 = pm25
            pm1 = data[0]
            pm10 = data[1]
            pm25 = data[2]
            
            # Applying the weighted formula (50% PM1, 35% PM2.5, 15% PM10)
            return (0.50 * pm1) + (0.35 * pm25) + (0.15 * pm10)
        
        indoor_risk_score = calculate_risk(indoor_aqi)
        outdoor_risk_score = calculate_risk(outdoor_aqi)
        
        GOOD_THRESHOLD = 30.0 
        BAD_THRESHOLD = 75.0
        
        
        if indoor_risk_score <= GOOD_THRESHOLD and outdoor_risk_score <= GOOD_THRESHOLD:
            return cls.both_good()
        elif indoor_risk_score > BAD_THRESHOLD and outdoor_risk_score > BAD_THRESHOLD:
            return cls.both_bad(indoor_risk_score, outdoor_risk_score)
        elif indoor_risk_score < outdoor_risk_score:
            return cls.indoor_better()
        else:
            return cls.outdoor_better()
    
    @classmethod
    def indoor_better(cls):
        return "Keep the windows closed and turn on the AC. Indoor air is currently cleaner."
    
    @classmethod
    def outdoor_better(cls):
        return "Open the windows! The outdoor air is cleaner right now and will help ventilate the space."
    
    @classmethod
    def both_good(cls):
        return "The air quality is great everywhere right now. Enjoy the fresh air!"
    
    @classmethod
    def both_bad(cls, in_aqi, out_aqi):
        suggestion = "Air quality is poor both inside and outside. "
        
        # Tie-breaker logic for when both are bad
        if in_aqi < out_aqi:
            suggestion += "Stay indoors and maximize air purifier settings."
        else:
            suggestion += "Indoor air is worse than outside, but both are consider dangerous please wear a mask"
            
        return suggestion