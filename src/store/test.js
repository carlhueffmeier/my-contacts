import Store from './index';

test('adding a contact automatically creates the new tags', async () => {
  var store = new Store();

  var leela = { name: 'Leela', tags: ['Work'] };
  store.addContact(leela);

  var allContacts = await store.getAllContacts();
  var allTags = await store.getAllTags();
  expect(allContacts).toContainEqual(
    expect.objectContaining({ name: 'Leela' })
  );
  expect(allTags).toContainEqual(expect.objectContaining({ label: 'Work' }));
});

test('tags are retrievable by contact id', async () => {
  var store = new Store();

  var leela = await store.addContact({
    name: 'Leela',
    tags: ['Work', 'Mutant']
  });
  var tags = await store.getTagsByContact(leela.id);

  expect(tags).toContainEqual(expect.objectContaining({ label: 'Work' }));
  expect(tags).toContainEqual(expect.objectContaining({ label: 'Mutant' }));
});

test('retrieving all contacts populates the entries with tags', async () => {
  var store = new Store();

  var leela = await store.addContact({
    name: 'Leela',
    tags: ['Work']
  });
  var allContacts = await store.getAllContacts();
  expect(allContacts[0]).toMatchObject({ name: 'Leela' });
  expect(allContacts[0].tags).toContainEqual(
    expect.objectContaining({ label: 'Work' })
  );
});

test('retrieving a contact by id populates it with tags', async () => {
  var store = new Store();

  var leela = await store.addContact({
    name: 'Leela',
    tags: ['Work', 'Mutant']
  });

  var result = await store.getContactById(leela.id);
  expect(result).toMatchObject({ name: 'Leela' });
  expect(result.tags).toContainEqual(
    expect.objectContaining({ label: 'Work' })
  );
});
