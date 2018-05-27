import Dataset from './dataset';

test('adding a contact automatically generates an id', async () => {
  var contacts = new Dataset();

  var leela = { name: 'Leela' };
  var result = await contacts.add(leela);
  expect(result).toHaveProperty('id');
});

test('getAll() returns content of dataset', async () => {
  var contacts = new Dataset();

  var leela = { name: 'Leela' };
  var fry = { name: 'Fry' };

  contacts.add(leela);
  var result = await contacts.getAll();
  expect(result).toContainEqual(expect.objectContaining(leela));
  contacts.add(fry);
  result = await contacts.getAll();
  expect(result).toContainEqual(expect.objectContaining(leela));
  expect(result).toContainEqual(expect.objectContaining(fry));
});

test('searching single entry with regular expressions', async () => {
  var contacts = new Dataset();

  var leela = { name: 'Leela' };
  contacts.add(leela);

  var result = await contacts.find({ name: /le{2}la/i });
  expect(result).toMatchObject(leela);
  result = await contacts.find({ name: /Zoidberg/i });
  expect(result).toBeUndefined();
});

test('searching multiple entries with regular expressions', async () => {
  var contacts = new Dataset();

  var characters = [{ name: 'Leela' }, { name: 'Linda' }];
  characters.forEach(c => contacts.add(c));

  var result = await contacts.findAll({ match: { name: /^L\w{4}/ } });
  expect(result).toContainEqual(expect.objectContaining(characters[0]));
  expect(result).toContainEqual(expect.objectContaining(characters[1]));
  result = await contacts.findAll({ match: { name: /Zoidberg/ } });
  expect(result).toEqual([]);
});

test('findOrCreate() works as expected', async () => {
  var contacts = new Dataset();

  var leela = { name: 'Leela' };
  var fry = { name: 'Fry' };
  var zoidberg = { name: 'Zoidberg' };
  [leela, fry].forEach(c => contacts.add(c));

  var result = await contacts.findOrCreate(leela);
  expect(result).toMatchObject(leela);
  expect(contacts.size()).toEqual(2);
  result = await contacts.findOrCreate(fry);
  expect(result).toMatchObject(fry);
  expect(contacts.size()).toEqual(2);
  result = await contacts.findOrCreate(zoidberg);
  expect(result).toMatchObject(zoidberg);
  expect(contacts.size()).toEqual(3);
});
