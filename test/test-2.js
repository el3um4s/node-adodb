/**
 * @module test
 * @license MIT
 * @version 2017/11/09
 */

'use strict';

const fs = require('fs');
const path = require('path');
const arch = require('arch');
const ADODB = require('../index');
const expect = require('chai').expect;
const holding = require('holding').assert;

const source = path.resolve('test/node-2.mdb');
const mdb = fs.readFileSync(require.resolve('../examples/test-2.mdb'));

fs.writeFileSync(source, mdb);

// Variable declaration
const x64 = arch() === 'x64';
const sysroot = process.env['systemroot'] || process.env['windir'];
const cscript = path.join(sysroot, x64 ? 'SysWOW64' : 'System32', 'cscript.exe');

if (fs.existsSync(cscript) && fs.existsSync(source)) {
  console.log('Use:', cscript);
  console.log('Database:', source);

  // Variable declaration
  const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + source + ';');

  describe('ADODB: test-2.mdb', () => {
    it('query simple', next => {
      connection
        .query('SELECT * FROM Users')
        .then(data => {
          expect(data.length).to.equal(7);
          expect(data[0]["UserName 1°"]).to.equal('John Doe');
          expect(data[0]).to.have.ownProperty('UserBirthday');
          expect(data[2]["UserName 1°"]).to.equal('Bill Red');
          next();
        })
        .catch(next);
    });

    it('query', next => {
      connection
        .query('SELECT * FROM [Colors 1°à]')
        .then(data => {
          expect(data.length).to.equal(7);
          expect(data[0]["Colors"]).to.equal('Red');
          expect(data[0]).to.have.ownProperty('Value');
          expect(data[1].Value).to.equal(5);
          next();
        })
        .catch(next);
    });

  });
} else {
  console.log('This OS not support node-adodb.');
}
