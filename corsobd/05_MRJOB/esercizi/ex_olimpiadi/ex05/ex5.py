from mrjob.job import MRJob
from mrjob.step import MRStep

# Exercise 5
# Partendo dall'esercizio precedente, restituire come output l'eta' con il numero maggiore di occorrenze.

# age,birthdate,gender,height,name,weight,gold_medals,silver_medals,
# bronze_medals,total_medals,sport,country

class MREx_05(MRJob):
    def steps(self):
        return [MRStep(mapper=self.lineMapper,
		reducer=self.ageReducer),
		MRStep(mapper=self.mapper_most,
		reducer=self.reducer_most)]

    def lineMapper(self, _, line):
         yield line.split(',')[0], 1

    def ageReducer(self, age, occurrences_list):
        yield age, sum(occurrences_list)

    def mapper_most(self, age, total):
        yield 'most_used', [total, age]

    def reducer_most(self, _, freqs):
        yield 'most_used', max(freqs)

if __name__ == '__main__':
    MREx_05.run()
