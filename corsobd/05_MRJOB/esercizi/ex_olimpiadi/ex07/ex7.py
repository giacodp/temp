from mrjob.job import MRJob
from mrjob.step import MRStep

# Exercise 7
# Calcolare per ogni nazione il numero di medaglie, rispettivamente per oro, argento e bronzo.

# age,birthdate,gender,height,name,weight,gold_medals,silver_medals,
# bronze_medals,total_medals,sport,country

class MREx_07(MRJob):
    def steps(self):
        return [MRStep(mapper=self.lineMapper,reducer=self.ageReducer),
               MRStep(mapper=self.mapper_max,reducer=self.reducer_max)]
    
    def lineMapper(self, _, line):
        if line.split(',')[11]=='country':
            pass
        else:
            yield [line.split(',')[11], 'gold'], int(line.split(',')[6])
            yield [line.split(',')[11], 'silver'],int(line.split(',')[7])
            yield [line.split(',')[11], 'bronze'],int(line.split(',')[8])
            yield [line.split(',')[11], 'total'],int(line.split(',')[9])
    
    def ageReducer(self, medal, occurrence):
        yield medal, sum(occurrence)

    def mapper_max(self, medal, occurrence):
        yield 'max', [occurrence, medal]
    
    def reducer_max(self, massimo, paese):
        yield massimo, max(paese)

if __name__ == '__main__':
    MREx_07.run()
