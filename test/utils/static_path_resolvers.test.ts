import {
  staticPathIntoUrl,
  staticUrlIntoPath,
  filenameIntoStaticPath,
  filenameIntoStaticUrl,
  filenameIntoAbsoluteTempPath,
} from '../../src/utils/static_path_resolvers';

describe('staticPathIntoUrl', () => {
  it('should return static url for avatars', () => {
    const result = staticPathIntoUrl(
      '/public/uploads/images/avatars/avatar.jpg',
      'avatars',
    );
    expect(result).toBe('/images/avatars/avatar.jpg');
  });
});

describe('staticUrlIntoPath', () => {
  it('should return absolute static path for avatars', () => {
    const result = staticUrlIntoPath(
      '/images/avatars/avatar.jpg',
      'avatars',
      true,
    );
    expect(result).toBe(
      process.cwd() + '/public/uploads/images/avatars/avatar.jpg',
    );
  });

  it('should return static path for avatars', () => {
    const result = staticUrlIntoPath('/images/avatars/avatar.jpg', 'avatars');
    expect(result).toBe('/public/uploads/images/avatars/avatar.jpg');
  });
});

describe('filenameIntoStaticPath', () => {
  it('should return absolute static path for avatars', () => {
    const result = filenameIntoStaticPath('avatar.jpg', 'avatars', true);
    expect(result).toBe(
      process.cwd() + '/public/uploads/images/avatars/avatar.jpg',
    );
  });

  it('should return static path for avatars', () => {
    const result = filenameIntoStaticPath('avatar.jpg', 'avatars');
    expect(result).toBe('/public/uploads/images/avatars/avatar.jpg');
  });
});

describe('filenameIntoStaticUrl', () => {
  it('should return static url for avatars', () => {
    const result = filenameIntoStaticUrl('avatar.jpg', 'avatars');
    expect(result).toBe('/images/avatars/avatar.jpg');
  });
});

describe('filenameIntoAbsoluteTempPath', () => {
  it('should return temp path for a given filename', () => {
    const result = filenameIntoAbsoluteTempPath('file.txt');
    expect(result).toBe(process.cwd() + '/public/uploads/temp/file.txt');
  });
});
