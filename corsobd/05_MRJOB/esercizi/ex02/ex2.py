from mrjob.job import MRJob
from mrjob.step import MRStep
import re

WORD_REGEXP = re.compile(r"[\w']+")

# Exercise 2
# From the lorem.txt file calculate how many words starts for each letter of the alphabet and print out the max and the min.


class MREx_02(MRJob):
    def steps(self):
        return [MRStep(mapper=self.mapper_lettercount,
                    reducer=self.reducer_lettercount),
                MRStep(mapper=self.mapper_letterfreq,
                    reducer=self.reducer_letterfreq),
                MRStep(mapper=self.mapper_lettermost,
                    reducer=self.reducer_lettermost)]

    def mapper_lettercount(self, _, line):
        
        words = WORD_REGEXP.findall(line)
        for word in words:
            yield word[0].lower(), 1

    def reducer_lettercount(self, word, counts):
        yield word, sum(counts)

    def mapper_letterfreq(self, word, total):
        yield total, word  # Le raggruppo per numero di occorrenze

    def reducer_letterfreq(self, total, words):
        # Avra' all'interno di total il numero di occorrenze
        # e all'interno di words un generatore che resituira le singole parole
        yield total, words.next()  # .next() restituisce il primo elemento, emetto quindi una sola parola per ogni frequenza

    def mapper_lettermost(self, freq, word):
        yield 'most_used', [freq, word]
	yield 'less_used', [freq, word] # Raggruppo le parole per una lista di tuple (frequenza, parola)

    def reducer_lettermost(self, key, freqs):
	if key == 'most_used':
		yield 'most_used', max(freqs)
	else: yield 'less_used', min(freqs)


if __name__ == '__main__':
    MREx_02.run()
