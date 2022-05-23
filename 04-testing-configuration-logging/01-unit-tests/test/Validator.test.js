const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      it('поле не должно быть короче минимума', () => {
        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('поле не должно быть длиннее максимума', () => {
        const errors = validator.validate({name: 'LalalaLalala LalalaLalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 25');
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      it('поле не должно быть меньше минимума', () => {
        const errors = validator.validate({age: 5});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 5');
      });

      it('поле не должно быть больше максимума', () => {
        const errors = validator.validate({age: 25});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 25');
      });
    });

    describe('валидатор проверяет тип поля в первую очередь', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      it('type number', () => {
        const errors = validator.validate({age: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('type string', () => {
        const errors = validator.validate({name: 5});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('type string and number both', () => {
        const errors = validator.validate({age: 'Lalala', name: 5});

        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
        expect(errors[1]).to.have.property('field').and.to.be.equal('name');
        expect(errors[1]).to.have.property('error').and.to.be.equal('expect string, got number');
      });
    });
  });
});
