const Tag = require('../../src/models/tag');
const db = require('../../db.js');
const { NotFoundError } = require('../../expressError');

beforeAll(async () => {
    await db.query('DELETE FROM recipe_tags')
    await db.query('DELETE FROM tags');
});

beforeEach(async () => {
    await db.query("BEGIN");
    await db.query('DELETE FROM tags');
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

afterAll(async () => {
    await db.end();
});

describe('tag model', () => {
    describe('create method', () => {
        it('should create a new tag', async () => {
            const tagToPersist = { value: 'Test' };
            const result = await Tag.create(tagToPersist);
            expect(result.id).toBeGreaterThan(0);
            expect(result.value).toBe('Test');
        });

        it('should not create duplicate tags', async () => {
            const tag = { value: 'Test' };

            const result = await Tag.create(tag);
            expect(result.id).toBeGreaterThan(0);
            expect(result.value).toBe('Test');

            await expect(Tag.create(tag)).rejects.toThrow();
        });
    });

    describe('readAll method', () => {
        it('retrieves all tags', async () => {

            // assign some tags to ensure there's data
            await Tag.create({ value: 'Test1' });
            await Tag.create({ value: 'Test2' });
            await Tag.create({ value: 'Test3' });

            const result = await Tag.readAll();

            expect(result.length).toBeGreaterThan(0);

            result.forEach((e) => {
                expect(e).toHaveProperty('value');
            })
        });

        it('retrieves no tags from empty database', async () => {
            const result = await Tag.readAll();
            expect(result.length).toBe(0);
        });
    });

    describe('readOneById method', () => {
        it('returns tag if exists', async () => {
            const tagToPersist = { value: 'Test' };
            const tag = await Tag.create(tagToPersist);

            const result = await Tag.readOneById(tag.id);
            expect(result.id).toBeGreaterThan(0);
            expect(result.value).toBe('Test');
        });

        it('throws NotFound if not exists', async () => {
            const fakeId = 999;
            await expect(Tag.readOneById(fakeId)).rejects.toThrow(NotFoundError);
        });
    });

    describe('readAllBySearchTerm method', () => {
        it('returns empty array when none found', async () => {
            const searchTerm = 'balls';
            const result = await Tag.readAllBySearchTerm(searchTerm);
            expect(result.length).toBe(0);
        });

        it('returns a list of tags containing search term', async () => {
            const tags = ['Test', 'Tea', 'Torque', 'Balls', 'Eggs'];
            await Promise.all(tags.map(value => Tag.create({ value })));

            const searchTerm = 'te';
            const result = await Tag.readAllBySearchTerm(searchTerm);
            expect(result.length).toBeGreaterThan(1);

            const resultValues = result.map((e) => e.value);

            expect(resultValues).toContain('Test');
            expect(resultValues).toContain('Tea');
            expect(resultValues).not.toContain('Balls');
        });
    });

    describe('update method', () => {
        it('throws NotFound if id not exists', async () => {
            const tagToEdit = { id: 999, value: 'newTest' };
            await expect(Tag.update(tagToEdit)).rejects.toThrow(NotFoundError);
        });

        it('edits the existing tag', async () => {
            const firstTag = { value: 'Test' };
            const tag = await Tag.create(firstTag);
            const tagId = tag.id;

            const tagToEdit = { id: tagId, value: 'newTest' };
            const result = await Tag.update(tagToEdit);

            expect(result.id).toBe(tagToEdit.id);
            expect(result.value).toBe(tagToEdit.value);
        });
    });

    describe('delete method', () => {
        it('throws 404 if not found', async () => {
            const tagId = 999;
            await expect(Tag.delete(tagId)).rejects.toThrow(NotFoundError);
        });

        it('successfully deletes tag', async () => {
            const firstTag = { value: 'Test' };
            const tag = await Tag.create(firstTag);
            const tagId = tag.id;

            const tagExists = await Tag.readOneById(tagId);
            expect(tagExists).not.toBeNull();

            await expect(Tag.delete(tagId)).resolves.not.toThrow(NotFoundError);

            await expect(Tag.delete(tagId)).rejects.toThrow(NotFoundError);
        })
    });
});