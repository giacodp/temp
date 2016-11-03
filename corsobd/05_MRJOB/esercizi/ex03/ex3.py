from mrjob.job import MRJob
from mrjob.step import MRStep
import re

## Exercise 3
# Write a MapReduce job that report the most frequent word grouped by word length.

WORD_REGEXP = re.compile(r"[\w']+")

class MREx_03(MRJob):
    def steps(self):
        return [MRStep(mapper=self.mapper_count,
                    reducer=self.reducer_count),
                MRStep(mapper=self.mapper_len,
                    reducer=self.reducer_len)]

    def mapper_count(self, _, line):
        
        words = WORD_REGEXP.findall(line)
        for word in words:
            yield word.lower(), 1

    def reducer_count(self, word, counts):
        yield word, sum(counts)

    def mapper_len(self, word, total):
        yield len(word), [total, word]  # Le raggruppo per numero di occorrenze

    def reducer_len(self, words, total):
        # Avra' all'interno di total il numero di occorrenze
        # e all'interno di words un generatore che resituira le singole parole
        yield words, max(total)  # .next() restituisce il primo elemento, emetto quindi una sola parola per ogni frequenza

    '''def mapper_lettermost(self, freq, word):
        yield 'most_used', [freq, word]  # Raggruppo le parole per una lista di tuple (frequenza, parola)

    def reducer_lettermost(self, _, freqs):
        yield 'most_used', max(freqs)'''


if __name__ == '__main__':
    MREx_03.run()
