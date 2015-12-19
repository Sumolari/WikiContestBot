var sprintf = require( "sprintf-js" )
  .sprintf;

module.exports = function ( date, bytesDelta, page, url, newArticle ) {

  this.date = date;
  this.bytesDelta = bytesDelta;
  this.page = page;
  this.url = url;
  this.newArticle = newArticle;

  this.toString = function () {
    return sprintf(
      "[%s](%s) %s (%d)",
      this.page,
      this.url,
      this.date,
      this.bytesDelta
    );
  };

  this.score = function () {
    return Math.floor( this.bytesDelta / 1000 ) + ( ( this.newArticle ) ? 1 :
      0 );
  };

};
