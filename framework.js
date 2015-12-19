var BBPromise = require( 'bluebird' ),
  request = require( 'request-promise' ),
  cheerio = require( 'cheerio' ),
  moment = require( 'moment' ),
  _ = require( 'lodash' ),
  sprintf = require( "sprintf-js" )
  .sprintf,
  Contribution = require( './contribution.js' ),
  projects = require( './wikiprojects.json' ),
  findBytesRegex = /\((.*)\)/;

require( 'colors' );

module.exports = {

  getUserContributionsInProject: function ( user, project, minDate, maxDate ) {
    var
      date_format = projects[ project ].date_format,
      locale = projects[ project ].locale,
      baseurl = projects[ project ].baseurl,
      url_format = projects[ project ].url_format,
      url = sprintf( url_format, user, 50 );

    if ( minDate === undefined ) {
      minDate = moment( '1980-1-1', 'YYYY-MM-DD' );
    }

    if ( maxDate === undefined ) {
      maxDate = moment( new Date() );
    }

    console.log(
      'Querying'.blue,
      user.underline.yellow,
      'please, wait...'.blue
    );

    return request( url )
      .then( function ( html ) {

        var contributions = {};

        $ = cheerio.load( html );

        $( 'ul.mw-contributions-list li' )
          .each( function () {
            moment.locale( locale );
            var
              title = $( 'a.mw-contributions-title', this )
              .text(),
              url = baseurl + $( 'a:first-child', this )
              .attr( 'href' )
              .split( '&' )[ 0 ],
              date = moment( $( 'a:first-child', this )
                .text(), date_format ),
              bytesDelta = parseInt( findBytesRegex.exec(
                $(
                  '.mw-plusminus-pos, .mw-plusminus-null, .mw-plusminus-neg',
                  this )
                .text()
              )[ 1 ] ),
              newArticle = $( 'abbr.newpage', this )
              .text() === 'N';

            if ( date.isBetween( minDate, maxDate ) ) {

              if ( contributions[ url ] === undefined ) {
                contributions[ url ] = new Contribution( date,
                  bytesDelta, title, url, newArticle );
              } else {
                contributions[ url ].bytesDelta += bytesDelta;
                if ( newArticle ) {
                  contributions[ url ].newArticle = true;
                }
              }
            }

          } );

        console.log( 'Successfully processed'.green, user.underline.yellow );

        return contributions;

      } )
      .catch( function ( error ) {
        console.error(
          'There was an error querying'.red,
          user.underline.yellow,
          'debug info below:'.red
        );
        console.error( error );
      } );
  },

  getUserContributionsInAllProjects: function ( user, minDate, maxDate ) {
    var user_contributions = {},
      promises = [],
      promise,
      that = this;

    _.forEach( Object.keys( projects ), function ( project_key ) {
      promise = that.getUserContributionsInProject( user, project_key,
          minDate, maxDate )
        .then( function ( contributions ) {
          user_contributions[ project_key ] = contributions;
        } );
      promises.push( promise );
    } );

    return BBPromise.all( promises )
      .then( function () {
        return user_contributions;
      } );
  }

};
