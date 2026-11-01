import fs from 'fs';
import * as mm from 'music-metadata';

// 1. Read original song 3 (NEVER modify original song 3.mpeg!)
const buf = fs.readFileSync('song 3.mpeg');

// ID3v2 header
const id3Size = (buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9];
const headerLen = 10 + id3Size;
const id3Header = buf.subarray(0, headerLen);

// Audio frames starting at 18.024s (frame 690, byte offset 445420)
const cutOffset = 445420;
const trimmedAudio = buf.subarray(cutOffset);

// New trimmed MP3 buffer
const newMP3 = Buffer.concat([id3Header, trimmedAudio]);

const outPath = 'public/assets/audio/playlist/song-03.mp3';
fs.writeFileSync(outPath, newMP3);
console.log(`Wrote trimmed MP3 to ${outPath}, new size: ${newMP3.length} bytes (trimmed ${cutOffset - headerLen} bytes of audio)`);

// Verify with music-metadata
const metadata = await mm.parseFile(outPath);
console.log('New Song 3 duration:', metadata.format.duration, 'seconds');
console.log('Original duration was ~304.38s. Difference:', 304.3787755102041 - metadata.format.duration);
