var fs = require('fs');
var rp = require('request-promise-native');

var args = {
    accessToken: '',
    appID: '',
    releaseNotes: '',
    filePath: '',
}

process.argv.forEach(val => {
    if (val.indexOf('=') > 0) {
        var pair = val.split('=');
        args[pair[0]] = pair[1];
    }
});

console.log('[App47]',args);

var fileUploadRequest = {
    method: 'POST', 
    uri: 'https://cirrus.app47.com/api/v2/upload_file',
    headers: {
        'Access-Token': args.accessToken,
    },
    formData: {
        file: fs.createReadStream(args.filePath),
    },
    json: true,
};

console.log('[App47]','starting upload...');
rp(fileUploadRequest)
    .then(result => {
        console.log('[App47]','fileUploadRequest result',result);
        var fileID = result.results.file_id;

        var createBuildRequest = {
            method: 'POST', 
            uri: `https://cirrus.app47.com/api/v2/apps/${args.appID}/builds`,
            headers: {
                'Access-Token': args.accessToken,
                'Content-Type': 'application/json',
            },
            body: {
                build: {
                    build_upload_file_id: fileID,
                    release_notes: args.releaseNotes,
                    make_active: true,
                    notify_users_on_activation: false,
                    update_app_icon: true,
                    update_app_name: true,
                }
            },
            json: true,
        };

        rp(createBuildRequest)
            .then(res => {
                console.log('[App47]','createBuildRequest result',result);
            })
            .catch(err => {
                console.log('[App47]','ERROR',err);
            })
    })
    .catch(err => {
        console.log('[App47]','ERROR',err);
    });
