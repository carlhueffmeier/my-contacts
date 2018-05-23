import characters from './futuramaCharacters';

export default function createSampleData() {
  return characters.map(character => ({
    name: { firstName: character.firstName, lastName: character.lastName },
    phone: [{ label: 'Mobile', value: '555 - 42 42 2121' }],
    notes: `<em>Voiced By: ${character.voiceActor}</em><br><br>${
      character.notes
    }`,
    twitter: `@${character.firstName.toLowerCase().replace(/\W/g, '')}`,
    tags: ['Work']
  }));
}
