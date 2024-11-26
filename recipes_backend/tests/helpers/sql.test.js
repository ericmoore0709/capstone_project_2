const { sqlForPartialUpdate } = require('../../src/helpers/sql');
const { BadRequestError } = require('../../expressError');

describe("sqlForPartialUpdate", () => {
    test("generates correct SQL query for valid input with jsToSql mapping", () => {
        const dataToUpdate = { firstName: "Aliya", age: 32 };
        const jsToSql = { firstName: "first_name" };

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toEqual({
            setCols: '"first_name"=$1, "age"=$2',
            values: ["Aliya", 32],
        });
    });

    test("generates correct SQL query for valid input without jsToSql mapping", () => {
        const dataToUpdate = { firstName: "Aliya", age: 32 };
        const jsToSql = {};

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toEqual({
            setCols: '"firstName"=$1, "age"=$2',
            values: ["Aliya", 32],
        });
    });

    test("throws BadRequestError if no data is provided", () => {
        expect(() => {
            sqlForPartialUpdate({}, {});
        }).toThrow(BadRequestError);
    });

    test("handles mixed keys with some jsToSql mappings and some without", () => {
        const dataToUpdate = { firstName: "Aliya", lastName: "Smith", age: 32 };
        const jsToSql = { firstName: "first_name", lastName: "last_name" };

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toEqual({
            setCols: '"first_name"=$1, "last_name"=$2, "age"=$3',
            values: ["Aliya", "Smith", 32],
        });
    });
});
