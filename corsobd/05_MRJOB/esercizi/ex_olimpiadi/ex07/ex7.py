from mrjob.job import MRJob
from mrjob.step import MRStep

# Exercise 7
# Calcolare per ogni nazione il numero di medaglie, rispettivamente per oro, argento e bronzo.

# age,birthdate,gender,height,name,weight,gold_medals,silver_medals,
# bronze_medals,total_medals,sport,country

class MREx_07(MRJob):
    def steps(self):
        return [MRStep(mapper=self.lineMapper,reducer=self.ageReducer)]
    
    def lineMapper(self, _, line):
        if line.split(',')[12]=='country':
            pass
        else:
            yield [line.split(',')[2], int(line.split(',')[12])],1
    
    def ageReducer(self, gender, occurrence):
        yield gender, sum(occurrence)

if __name__ == '__main__':
    MREx_07.run()
