// tests/playlist.test.js
const request = require('supertest');
const app = 'http://localhost:3000'; // Make sure this is the correct URL to your app

describe("Playlist API", function() {
    const userId = "Bau8YWapDKX6RnQXW382NY1wvtq1"; // Fixed user ID as per your use case

    it("should create a new playlist and return a 201 status code", function(done) {
        const newPlaylistData = {
            title: "Chill Beats",
            description: "A playlist full of relaxing music."
        };

        request(app)
            .post(`/api/playlist/${userId}`)
            .send(newPlaylistData)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.error("Test failed with an error:", err);
                    console.error("Response was:", res.body);
                    return done.fail(err);
                }

                // Check if response contains the ID
                expect(res.body).toEqual(jasmine.objectContaining({
                    id: jasmine.any(String)
                }));

                console.log(res.body);
                console.log("Test passed: New playlist created with ID:", res.body.id);
                done();
            });
    });
});
