import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

const output = fs.createWriteStream(path.join(process.cwd(), 'compteur-references.zip'));
const archive = archiver.create('zip', {
  zlib: { level: 9 } // Sets the compression level
});

output.on('close', () => {
  console.log(`Archive created successfully: ${archive.pointer()} total bytes`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(path.join(process.cwd(), 'dist'), false);
archive.finalize(); 