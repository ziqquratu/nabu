import {ModelAnnotation} from '@ziggurat/common';
import {Container} from '@ziggurat/tiamat';
import {Collection, CollectionConfig, SourceProducer} from '@ziggurat/isimud';
import {Persistence} from '@ziggurat/isimud-persistence';
import {DirectoryConfig, FileSystemConfig} from '../interfaces';
import {Directory} from '../adapters/directory';
import {FSWatcher} from 'chokidar';

export function directory(config: DirectoryConfig): SourceProducer {
  return (container: Container, ctrlConfig: CollectionConfig): Collection => {
    const persistence = container.get<Persistence>('isimud.Persistence');
    const fsConfig = container.get<FileSystemConfig>('isimud.FileSystemConfig');
    const watcher = fsConfig.watch ? container.get<FSWatcher>('chokidar.FSWatcher') : undefined;
    const modelName = ctrlConfig.model
      ? ModelAnnotation.onClass(ctrlConfig.model || Document)[0].name
      : undefined;
    return persistence.createCollection(ctrlConfig,
      new Directory(config.serializer(container), config.path, config.extension, watcher),
      modelName
    );
  };
}
