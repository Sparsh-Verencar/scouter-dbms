import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'users.json');

let writeLock = Promise.resolve();

async function readUsers() {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeUsers(users) {
  const write = async () => {
    const tmp = FILE + '.tmp';
    const data = JSON.stringify(users, null, 2);
    await fs.writeFile(tmp, data, 'utf8');
    await fs.rename(tmp, FILE);
  };
  writeLock = writeLock.then(write, write);
  return writeLock;
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const users = await readUsers();
  return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser({ email, passwordHash, name }) {
  const users = await readUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    const err = new Error('UserExists');
    err.code = 'UserExists';
    throw err;
  }
  const id = users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
  const user = { id, email, name: name || null, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  await writeUsers(users);
  const { passwordHash: _, ...safe } = user;
  return safe;
}
