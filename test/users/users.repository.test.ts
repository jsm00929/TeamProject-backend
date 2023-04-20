import usersRepository from '../../src/users/users.repository';
import { randomEmail, randomString } from '../../src/utils/rand';
import { User } from '@prisma/client';
import { prisma } from '../../src/config/db';

describe('usersRepository', () => {
  const email = randomEmail();
  const name = randomString();
  const password = randomString();
  let newUserId: number;
  let createdUser: User;

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: newUserId,
      },
    });
  });
  describe('create', () => {
    it('should create a new user and return the user id', async () => {
      // Arrange
      const createUserBody = { email, name, password };

      // Act
      const userId = await usersRepository.create(createUserBody);

      // Assert
      expect(userId).not.toBeNull();
      expect(typeof userId).toBe('number');
      newUserId = userId;
    });

    it('should throw an error if the email already exists', async () => {
      const createUserBody = { email, name, password };

      await expect(usersRepository.create(createUserBody)).rejects.toThrow(
        Error,
      );
    });
  });
  describe('findById', () => {
    it('should return null if the user does not exist', async () => {
      const userId = -1;

      const user = await usersRepository.findById(userId);

      expect(user).toBeNull();
    });

    it('should return the user if the user exists', async () => {
      const user = await usersRepository.findById(newUserId);

      expect(user).not.toBeNull();
      expect(user!.email).toBe(email);
      expect(user!.name).toBe(name);
      expect(user!.password).toBe(password);

      createdUser = user!;
    });
  });

  describe('findByEmail', () => {
    it('should return null if the user does not exist', async () => {
      const email = 'notexists@not.exists';

      const user = await usersRepository.findByEmail(email);
      expect(user).toBeNull();
    });

    it('should return the user if the user exists', async () => {
      const user = await usersRepository.findByEmail(email);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(newUserId);
      expect(user!.name).toBe(name);
      expect(user!.password).toBe(password);
    });
  });

  describe('isExistsById', () => {
    it('should return true if the user exists', async () => {
      const exists = await usersRepository.isExistsById(newUserId);

      expect(exists).toBe(true);
    });

    it('should return false if the user does not exist', async () => {
      const exists = await usersRepository.isExistsById(-1);

      expect(exists).toBe(false);
    });
  });

  describe('isExistsByEmail', () => {
    it('should return true if the user exists', async () => {
      const exists = await usersRepository.isExistsByEmail(email);

      expect(exists).toBe(true);
    });

    it('should return false if the user does not exist', async () => {
      const email = 'noteixsts@not.exists';

      const exists = await usersRepository.isExistsByEmail(email);

      expect(exists).toBe(false);
    });
  });

  describe('remove', () => {
    it('should throw an error if deletion fails', async () => {
      const removePromise = usersRepository.remove(-1);

      await expect(removePromise).rejects.toThrow(Error);
    });

    it('should remove user when the input userId is exist', async () => {
      const removePromise = usersRepository.remove(newUserId);

      await expect(removePromise).resolves.not.toThrow(Error);
    });
  });
});
