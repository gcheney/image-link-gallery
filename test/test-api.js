process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');

var app = require('../app');
var Image = require('../api/models/image');

var should = chai.should();
chai.use(chaiHttp);

describe('Images', function() {
    
    Image.collection.drop();

    beforeEach(function(done) {
        var newImage = new Image({
            title: 'Great Image',
            description: 'The best image',
            creator: 'Me',
            url: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg'
        });
        newImage.save(function(err) {
            if (err) {
                console.log(err);
            }
            done();
        });   
    });
    
    afterEach(function(done) {
        Image.collection.drop();
        done();
    });
    
    it('should list ALL images on /images GET', function(done) {
        chai.request(app)
            .get('/api/images')
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                }
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('creator');
                res.body[0].creator.should.equal('Me');
                res.body[0].title.should.equal('Great Image');
                done();
            });
    });
    it('should list a SINGLE image on /images/:id GET');
    it('should add a SINGLE image on /images POST');
    it('should update a SINGLE image on /images/:id PUT');
    it('should delete a SINGLE image on /images/:id DELETE');
});