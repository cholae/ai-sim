from Scripts.objects import Object

class Environment:
    def __init__(self, name, age_in_years, population):
        self.name = name
        self.age_in_years = age_in_years
        self.population = population
        self.objects = {}
        self.history = []
        self.quality = 0

    def add_object(self, obj):
        if isinstance(obj, Object):  # Ensure that the added object is an instance of the Object class or its subclasses.
            if obj.name in self.objects:
                #self.objects.update(obj.name)
                print ("no can do")
            else:
                self.objects[obj.name] = obj
                #TODO: update quality based on resources/agents/etc
        else:
            raise ValueError(f"The provided object '{obj}' is not an instance of 'Object' or its subclasses.")

    def remove_object(self, object_name):
        self.objects = [obj for obj in self.objects if obj.name != object_name]

    def describe(self):
        description = f"Environment: {self.name}\n\nObjects:\n"
        for obj in self.objects:
            description += f"- {self.objects[obj].name}: {self.objects[obj].describe()}\n"
        
        return description