'use strict';

const _       = require( 'lodash' );
const Co      = require( 'co' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


export function loadConfig() {

    return Co( function *() {

        let mode = _.get( this.env, 'mode' );
        let path = _.get( this.env, 'paths.app' );

        let patterns = [
            '*/config/defaults.js',
            '*/config/defaults/**.js'
        ];

        if ( mode )
        {
            patterns.push( '*/config/' + mode + '.js' );
            patterns.push( '*/config/' + mode + '/**.js' );
        }

        let globs = yield patterns.map( pattern => Glob( pattern, { cwd: path, nomount: true } ) );

        globs.forEach( files => {

            files.forEach( file => {

                let name = _( file )
                    .chain()
                    .replace( /\.js$/gi, '' )
                    .trim( '\\\/' )
                    .split( /[\\\/]/g )
                    .tap( nodes => {
                        nodes.splice( 1, 2 );
                    } )
                    .join( '.' );

                let value = require( path + '/' + file );

                if ( !_.isPlainObject( value ) )
                {
                    value = {};
                }

                merge( this.config, _.set( {}, name, value ) );

            } );

        } );

    }.bind( this ) );

}


export function loadControllers() {

    return Co( function *() {

        let path  = _.get( this.env, 'paths.app' );
        let files = yield Glob( '*/controllers/**.js', { cwd: path, nomount: true } );

        files.forEach( file => {


        } );

    }.bind( this ) );

}


function merge( a, b ) {

    if ( !_.isPlainObject( a ) || !_.isPlainObject( b ) )
    {
        return b;
    }

    return _.merge( a, b, merge );

}
