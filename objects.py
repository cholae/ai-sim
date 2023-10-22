import random;

class Object:
    def __init__(self, name, description, quality=0):
        self.name = name
        self.description = description
        self.quality = quality

    def describe(self):
        return self.description

    def apply_effect(self, obj, effect):
        if isinstance(effect, Effect):
            if isinstance(obj, Object):
                obj.quality += effect.impact
            else:
                raise NameError('Attempted to affect a variable that was not an Object: ' + obj)
        else:
            raise NameError('Attempted to apply_effect with no Effect object: ' + effect)
        
    


class Event(Object):
    def __init__(self, name,  description, quality, event_type, frequency, impact, duration):
        super().__init__(name, description, quality)
        self.event_type = event_type   # e.g., "natural_disaster", "festival", "market_crash"
        self.frequency = frequency     # e.g., 0 for one time, scale for # per year i.e. 3 would mean 3 events of this type per year (or equivalent odds)
        self.impact = impact           # e.g., "beneficial", "neutral", "harmful"
        self.duration = duration       # e.g., 0 for permanent, otherwise year value

    def describe(self):
        return f"This is a {self.frequency} {self.event_type} event with a {self.impact} impact lasting {self.duration}."

class Resource(Object):
    def __init__(self, name, description, quality, abundance, renewability):
        super().__init__(name, description, quality) #name e.g. "water" "lumber" "oil"
        self.abundance = abundance          # e.g., "plentiful", "scarce"
        self.renewability = renewability    # e.g., "renewable", "non-renewable"

    def describe(self):
        return f"This is a {self.quality} quality {self.name} resource. It has an abundance of {self.abundance} and is {self.renewability} renewable."
    
class Effect():
    def __init__(self, impact, description):
        self.impact = impact #e.g. positive or negative by value between -1 and 1
        self.description = description #e.g. rising population had a negative effect on the water quality in the area