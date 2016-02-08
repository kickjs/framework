'use strict';

const fs      = require( 'fs' );
const _       = require( 'lodash' );
const Promise = require( 'bluebird' );


_.each( fs, function ( fn, name ) {

    let suffix = /Sync$/;

    if ( suffix.test( name ) )
    {
        name = name.replace( suffix, '' );

        if ( _.isFunction( fs[ name ] ) )
        {
            fs[ name + 'Async' ] = Promise.promisify( fs[ name ] );
        }
    }

} );


module.exports = fs;
