const assert = require('assert');

const {copy, isSame} = require('..');

describe('iCopier / isSame', () => {

    it('isSame / example', () => {

        assert(isSame('some string', 'some string'));

        let user = {
            name: 'slava'
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.name = 'updated';
        assert(!isSame(user, clone));
    });

    it('isSame / example (infinity depth)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.settings.allow_notification = false;
        assert(!isSame(user, clone));

        user.settings.allow_notification = true;
        assert(isSame(user, clone));
    })

    it('isSame / example (infinity depth strict)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.settings = {
            allow_notification: true,
        };

        assert(!isSame(user, clone));
        assert(isSame(user, clone, null, {strictOrigin: false}));
    })

    it('isSame / example (depth=0)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user, 0);
        assert(isSame(user, clone, 0));
        user.name = 'updated';

        assert(!isSame(user, clone, 0));
        user.name = 'slava';

        assert(isSame(user, clone, 0));

        user.settings.allow_notification = false;
        assert(isSame(user, clone, 0));
    });

    it('isSame / custom fields', () => {
        let user = {
            name: 'slava'
        };

        let clone = copy(user);
        assert(isSame(user, clone));

        user.customField = 'foo';
        assert(!isSame(user, clone));

        delete user.customField;
        assert(isSame(user, clone));
    });


    it('isSame / example (depth=1)', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user, 1);
        assert(isSame(user, clone, 1));

        user.settings.allow_notification = false;
        assert(isSame(user, clone, 0));
        assert(!isSame(user, clone, 1));
        assert(!isSame(user, clone, 20));
        assert(!isSame(user, clone, null));
    })



    it('isSame / example (depth=1-2) array', () => {
        let user = {
            name: 'slava',
            settings: {
                allow_notification: true,
            },
            picked: [{id: 1}, {id: 2}]
        };

        let clone = copy(user, 2);
        assert(isSame(user, clone, 2));

        user.picked[0].id = 100;
        assert(isSame(user, clone, 0));
        assert(isSame(user, clone, 1));

        assert(!isSame(user, clone, 2));
        assert(!isSame(user, clone, 10));
        assert(!isSame(user, clone, null));
    })
});

const show = (clone) => Object.getOwnPropertyNames(clone).map((name) => console.log('>', name, ':', clone[name]));