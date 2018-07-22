import characters from './futuramaCharacters';

export default function createSampleData() {
  return characters.map(
    ({ firstName, lastName = '', voiceActor = 'N/A', notes, label = [] }) => ({
      name: { firstName, lastName },
      phone: [{ label: 'Mobile', value: '555 - 42 42 2121' }],
      notes: `<em>Voiced By: ${voiceActor}</em><br><br>${notes}`,
      twitter: `@${firstName.toLowerCase().replace(/\W/g, '')}`,
      tags: [...label, 'Futurama 📺']
    })
  );
}
