def name_cleaner (self):

	'''
	name_cleaner (self, *common_names)
	
	INPUT:
	type(self)	->	str
	
	OUTPUT:
	type(self)	->	str
	
	FUNCTION:
	replacing a bunch of elements ('/', '-', ',', '.', 'srl', 'spa), lower or uppercase, with spaces.  
	'''
	
	self = self.lower().replace('/',' ').replace('-',' ').replace(',',' ').replace('.',' ')\
	.replace('srl',' ').replace('s r l',' ').replace('s  r  l',' ')\
	.replace('spa',' ').replace('s p a',' ').replace('s  p  a',' ')\
	.replace('de ','de').replace('di ','di').replace("d' ","d'")
	return self

def check_match (nameA, nameB, *common_names):
	
	'''
	check_match (nameA, nameB, *common_names)
	
	INPUT:
	type(nameA)			->	str
	type(nameA)			->	str
	type(*common_names)	->	tuple (common names     from a Dataframe object,
									garbage metadata from a Dataframe object)
	
	OUTPUT:
	type(match)			->	int64
	
	FUNCTION:
	nameA and nameB (and eventually *common_names) will be cleaned thanks to name_cleaner function (see reference).
	Than they will be split each one in a list and cleaned up from duplicates.
	If *common_names exist, each element of each list which match with any of names into *common_names will be removed.
	Then they will be merged in a list.
	At that point a for-cycle will create a dictionary with each word as key and with the count of its occurence as value.
	Because we want to check if nameA and namesB have some word in common, we are interested in value = 2 (no value > 2 is possible, because there are no more duplicates)
	Finally the function return the variable 'match': how many 'value = 2' are in the dictionary.
	
	TIPS:
	if match = 1 --> it could be (same name) or (same surname),
	if match = 2 --> it could be (same two names) or (same two surnames) or (same name and surname),
	if match > 2 --> it could be near to nameA = nameB.
	'''
	
	ordinante = name_cleaner(nameA)
	partial_ordinante = list(set(ordinante.split()))
	try:
		for each_common_names in common_names[0]:
			each_common_names_lower = each_common_names.lower().strip()
			try: partial_ordinante.remove(each_common_names_lower)
			except: pass
	except: pass
	
	beneficiario = name_cleaner(nameB)
	partial_beneficiario = list(set(beneficiario.split()))
	try:
		for each_common_names in common_names[0]:
			each_common_names_lower = each_common_names.lower().strip()
			try: partial_beneficiario.remove(each_common_names_lower)
			except: pass
	except: pass
	
	names_union =partial_ordinante + partial_beneficiario
	wordcounts={}
	for single_word in names_union:
		wordcounts[single_word] = names_union.count(single_word)
	match = wordcounts.values().count(2)
	return match


def matching_evaluation(data, output_column_name, nameA, nameB, *common_names):
	
	'''
	matching_evaluation(data, output_column_name, nameA, nameB, *common_names)
	
	INPUT:
	type(data)			->	pandas.core.frame.DataFrame
	output_column_name	->	str
	type(nameA)			->	str
	type(nameA)			->	str
	type(*common_names)	->	tuple (common names     from a Dataframe object,
									garbage metadata from a Dataframe object)
	
	OUTPUT:
	type(data)			->	pandas.core.frame.DataFrame
	
	FUNCTION:
	check_match function (see reference) for-cycled on data. A column with the results of matching is added to data.
	'''
	
	data[output_column_name] = 0
	for row in data.index:
		data[output_column_name][row] = check_match(data[nameA][row],data[nameB][row],*common_names)

def matching_ordinante_beneficiario (data, output_column_name, nameA, nameB, *common_names, **output_file_csv):
    
    '''
    matching_ordinante_beneficiario (data, output_column_name, nameA, nameB, *common_names, output_file_name = None)
    
    INPUT:
	type(data)				->	pandas.core.frame.DataFrame
	output_column_name		->	str
	type(nameA)				->	str
	type(nameA)				->	str
	type(*common_names)		->	tuple (common names     from a Dataframe object,
										garbage metadata from a Dataframe object)
	type(output_file_name)	->	str
	
	OUTPUT:
	type(data)			->	pandas.core.frame.DataFrame
	type(file)*			->	.csv							* OPTIONAL
	
	FUNCTION:
	it allows a matching_evaluation (see reference) between names under the columns data[nameB] and data[nameB].
	If *common_names exist, three column of data will be created:
	I.	matching nameA and nameB without removing common names, counting the occurences as explained for check_match (see reference)
	II.	matching nameA and nameB removing common names, counting the occurences as explained for check_match (see reference)
	III. summing the counts for I and II.
	If output_file_name is specified then a comma-separated values (.csv) file will be created.
	
	TIPS:
	if sum of counts for I and II	=	0 -->	no match,
	if sum of counts for I and II	=	1 -->	probably it's only the common name,
	if sum of counts for I and II	=	2 -->	it could be that nameA and nameB are related somehow (same surname), 
	if sum of counts for I and II	>=	3 -->	it could be near to nameA = nameB.
	'''	
	
    output_column_name = output_column_name.upper()
    matching_evaluation(data, output_column_name+'_NAMES_AND_SURNAMES', nameA, nameB)
    if common_names is not ():
        matching_evaluation(data, output_column_name+'_SURNAMES', nameA, nameB, *common_names)
        data[output_column_name] = data[output_column_name+'_NAMES_AND_SURNAMES']+data[output_column_name+'_SURNAMES']
    try:
        data.to_csv(output_file_csv['output_file_name'], columns=[data.columns[0],nameA,nameB, data.columns[-1]],index=False)
    except: pass