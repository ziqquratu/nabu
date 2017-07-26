import {provider} from '@ziggurat/tiamat';
import fs = require('fs');
import * as chokidar from 'chokidar';
import {relative, join} from 'path';
import {EventEmitter} from 'eventemitter3';
import {FileSystem} from './interfaces';

@provider({
  for: 'isimud.FileSystem',
  singleton: true
})
export class FileSystemService extends EventEmitter implements FileSystem {
  private root: string = join(process.cwd(), 'content');

  public constructor() {
    super();
    chokidar.watch(this.root, {
      ignoreInitial: true,
      persistent: true,
    })
      .on('add', (path: string) => {
        this.emit('file-added', relative(this.root, path));
      })
      .on('change', (path: string) => {
        this.emit('file-changed', relative(this.root, path));
      })
      .on('unlink', (path: string) => {
        this.emit('file-removed', relative(this.root, path));
      })
      .on('ready', () => {
        this.emit('ready');
      });
  }

  public readdir(path: string): any {
    return fs.readdirSync(join(process.cwd(), 'content', path));
  }

  public read(path: string): any {
    let file = join(process.cwd(), 'content', path);
    return fs.readFileSync(file, 'utf8');
  }

  public write(data: string, path: string): void {
    let relPath = join('content', path);
    fs.writeFileSync(join(process.cwd(), relPath), data, {encoding: 'utf8'});
    this.emit('file-stored', data, relPath);
  }
}
