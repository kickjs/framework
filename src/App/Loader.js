'use strict';

const _       = require( 'lodash' );
const Co      = require( 'co' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


export function loadConfig() {

    return Co( function *() {

        let mode       = _.get( this.Env, 'mode' );
        let appPath    = _.get( this.Env, 'paths.app' );
        let configPath = _.get( this.Env, 'paths.config' );

        let patterns = [ 'defaults.js', 'defaults/**.js' ];

        if ( mode )
        {
            patterns.push( mode + '.js', mode + '/**.js' );
        }

        let results = [];

        yield globMulti( configPath, ...patterns )
            .each( ( [ file, nodes ] ) => {

                nodes.splice( 0, 1 );

                results.push( [ file, nodes ] );

            } );

        yield globMulti( appPath, ...patterns.map( pattern => '*/Config/' + pattern ) )
            .each( ( [ file, nodes ] ) => {

                nodes.splice( 1, 2 );

                results.push( [ file, nodes ] );

            } );

        results.forEach( ( [ file, nodes ] ) => {

            let name  = nodes.join( '.' );
            let value = require( file );

            if ( !_.isPlainObject( value ) )
            {
                value = {};
            }

            if ( name )
            {
                value = _.set( {}, name, value );
            }

            merge( this.config, value );

        } );

    }.bind( this ) );

}


export function loadNamespaces() {

    return Co( function *() {

        let path = _.get( this.Env, 'paths.app' );

        yield globMulti( path, '*/{Services,Helpers}' )
            .each( ( [ folder, nodes ] ) => {

                let namespace = nodes.join( '/' );

                this.Ioc.namespace( namespace, folder );

            } );

    }.bind( this ) );

}


export function loadControllers() {

    return Co( function *() {

        let path = _.get( this.Env, 'paths.app' );

        let controllers = {};

        yield globMulti( path, '*/Controllers/**.js' )
            .each( ( [ file, nodes ] ) => {

                nodes.splice( 1, 1 );

                let name  = nodes.join( '/' );
                let value = this.Ioc.make( file );

                controllers[ name ] = value;

            } );

        this.controllers = yield controllers;

    }.bind( this ) );

}


function globMulti( path, ...patterns ) {

    return Promise.all( patterns )
        .mapSeries( pattern => Glob( pattern, { cwd: path, nomount: true } ) )
        .reduce( ( results, files ) => results.concat( files ), [] )
        .mapSeries( file => [
            [ path, file ]
                .join( '/' ),
            _.chain( file )
                .replace( /\.js$/gi, '' )
                .split( /[\\\/]+/g )
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
