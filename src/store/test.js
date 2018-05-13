import Store from './index';

test('adding a contact adds it to the store', async () => {
  var store = new Store();

  var john = {
    name: 'John',
    email: 'john@yahulumail.com',
    mobile: '999 - 33 22 11'
  };
  store.addContact(john);
  var contents = await store.getAll();
  expect(contents).toMatchObject([john]);
});

test('find() with regular expressions works', async () => {
  var store = new Store();

  var john = {
    name: 'John',
    email: 'john@yahulumail.com',
    mobile: '999 - 33 22 11'
  };
  store.addContact(john);
  var searchResults = await store.find({ email: /huluMail/i });
  expect(searchResults).toMatchObject(john);
  var searchResults = await store.find({ email: /hulo/i });
  expect(searchResults).toBeUndefined();
});

test('findAll() with regular expressions works', async () => {
  var store = new Store();

  var contacts = [
    {
      name: 'John',
      email: 'john@yahulumail.com',
      mobile: '999 - 33 22 11'
    },
    {
      name: 'Marie',
      email: 'marie@yahulumail.com'
    }
  ];
  contacts.forEach(contact => store.addContact(contact));

  var searchResults = await store.findAll({ email: /yahulumail/ });
  expect(searchResults).toContainEqual(expect.objectContaining(contacts[0]));
  expect(searchResults).toContainEqual(expect.objectContaining(contacts[1]));
  searchResults = await store.findAll({ name: /Bob/ });
  expect(searchResults).toEqual([]);
});
