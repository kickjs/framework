'use strict';

const _           = require( 'lodash' );
const Co          = require( 'co' );
const Promise     = require( 'bluebird' );
const Glob        = Promise.promisify( require( 'glob' ) );


export function loadConfig() {

    return Co( function *() {

        let mode = _.get( this.Env, 'mode' );
        let path = _.get( this.Env, 'paths.app' );

        let patterns = [ '/defaults.js', '/defaults/**.js' ];

        if ( mode )
        {
            patterns.push( mode + '.js', mode + '/**.js' );
        }

        let files = _( yield patterns
            .map( pattern => Glob( '*/Config/' + pattern, { cwd: path, nomount: true } ) ) )
            .flatten()
            .value();

        files.forEach( file => {

            let name = _.chain( file )
                .replace( /\.js$/gi, '' )
                .split( /[\\\/]/g )
                .compact()
                .thru( ( [ name,,, ...names ] ) => [ name ].concat( names ).join( '.' ) )
                .value();

            let value = require( [ path, file ].join( '/' ) );

            if ( !_.isPlainObject( value ) )
            {
                value = {};
            }

            merge( this.config, _.set( {}, name, value ) );

        } );


    }.bind( this ) );

}


export function loadNamespaces() {

    return Co( function *() {

        let path = _.get( this.Env, 'paths.app' );

        let folders = yield Glob( '*/*/', { cwd: path, nomount: true } );

        folders.forEach( folder => {

            let namespace = _.chain( folder )
                .split( /[\\\/]/g )
                .compact()
                .join( '/' )
                .value();

            this.Ioc.namespace( namespace, [ path, folder ].join( '/' ) );

        } );

    }.bind( this ) );

}


export function loadControllers() {

    return Co( function *() {

        let path = _.get( this.Env, 'paths.app' );

        let files = yield Glob( '*/Controllers/**.js', { cwd: path, nomount: true } );

        let instances = yield _( files )
            .zipObject( files )
            .mapValues( file => this.Ioc.make( [ path, file ].join( '/' ) ) )
            .value();

        files.forEach( file => {

            let name = _.chain( file )
                .replace( /\.js$/gi, '' )
                .split( /[\\\/]/g )
                .compact()
                .thru( ( [ name,, ...names ] ) => [ name ].concat( names ).join( '/' ) )
                .value();

            let value = instances[ file ];

            merge( this.controllers, _.set( {}, name, value ) );

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
