from mrjob.job import MRJob
from mrjob.step import MRStep

# Exercise 6
# Calcolare il numero di uomini e donne per ogni eta.

# age,birthdate,gender,height,name,weight,gold_medals,silver_medals,
# bronze_medals,total_medals,sport,country

class MREx_06(MRJob):
    def steps(self):
        return [MRStep(mapper=self.lineMapper,reducer=self.ageReducer)]
    
    def lineMapper(self, _, line):
        if line.split(',')[0]=='age':
            pass
        else:
            yield [line.split(',')[2], int(line.split(',')[0])],1
    
    def ageReducer(self, gender, occurrence):
        yield gender, sum(occurrence)

if __name__ == '__main__':
    MREx_06.run()
