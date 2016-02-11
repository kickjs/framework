'use strict';

const _       = require( 'lodash' );
const Co      = require( 'co' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


export function loadConfig() {

    return Co( function *() {

        let mode = _.get( this.Env, 'mode' );
        let path = _.get( this.Env, 'paths.app' );

        let patterns = [ '*/Config/defaults.js', '*/Config/defaults/**.js' ];

        if ( mode )
        {
            patterns.push( '*/Config/' + mode + '.js', '*/Config/' + mode + '/**.js' );
        }

        let results = yield globMulti( path, ...patterns );

        results.forEach( ( [ file, nodes ] ) => {

            nodes.splice( 1, 2 );

            let name  = nodes.join( '.' );
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

        let results = yield globMulti( path, '*/{Services,Helpers}' );

        results.forEach( ( [ folder, nodes ] ) => {

            let namespace = nodes.join( '/' );
            let target    = [ path, folder ].join( '/' );

            this.Ioc.namespace( namespace, target );

        } );

    }.bind( this ) );

}


export function loadControllers() {

    return Co( function *() {

        let path = _.get( this.Env, 'paths.app' );

        let results = yield globMulti( path, '*/Controllers/**.js' );

        let instances = {};

        results.forEach( ( [ file, nodes ] ) => {

            nodes.splice( 1, 1 );

            let name = nodes.join( '/' );

            if ( !instances[ file ] )
            {
                instances[ file ] = this.Ioc.make( [ path, file ].join( '/' ) );
            }

            let value = instances[ file ];

            merge( this.controllers, _.set( {}, name, value ) );

        } );

        yield this.controllers;

    }.bind( this ) );

}


function globMulti( path, ...patterns ) {

    return Promise.all( patterns )
        .mapSeries( pattern => Glob( pattern, { cwd: path, nomount: true } ) )
        .reduce( ( results, files ) => results.concat( files ), [] )
        .mapSeries( file => [
            file,
            _.chain( file )
                .replace( /\.js$/gi, '' )
                .split( /[\\\/]/g )
                .compact()
                .value()
        ] );

}


function merge( a, b ) {

    if ( !_.isPlainObject( a ) || !_.isPlainObject( b ) )
    {
        return b;
    }

    return _.merge( a, b, merge );

}
