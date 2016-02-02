'use strict';

const _       = require( 'lodash' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


class Controller {

    static get services() {

        return [ 'env' ];

    }

    constructor( services ) {

        Object.assign( this, services, {
            controller: {}
        } );

        return this.load();

    }

    load() {

        let path     = _.get( this.env, 'paths.app' );

        return  Glob( '*/controller/*.js', { cwd: path, nomount: true } )
            .each( file => {

                let name = _( file )
                    .chain()
                    .replace( /\.js$/gi, '' )
                    .trim( '\\\/' )
                    .split( /[\\\/]/g )
                    .tap( nodes => {
                        nodes.splice( 1, 1 );
                    } )
                    .join( '.' );

                let value = require( path + '/' + file );

                merge( this.controller, _.set( {}, name, value ) );

            } )
            .return( this );

    }

}


function merge( a, b ) {

    if ( !_.isPlainObject( a ) || !_.isPlainObject( b ) )
    {
        return b;
    }

    return _.merge( a, b, merge );

}


module.exports = Controller;
