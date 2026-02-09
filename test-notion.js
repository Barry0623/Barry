const { Client } = require('@notionhq/client');

const notion = new Client({ auth: 'dummy_key' });

console.log('notion.databases type:', typeof notion.databases);
console.log('notion.databases prototype:', Object.getPrototypeOf(notion.databases));
console.log('notion.databases property names:', Object.getOwnPropertyNames(Object.getPrototypeOf(notion.databases)));

try {
    console.log('query method:', notion.databases.query);
} catch (e) {
    console.log('Error accessing query:', e.message);
}
