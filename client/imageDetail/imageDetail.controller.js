(function () {
    
    angular
        .module('imageGalleryApp')
        .controller('imageDetailController', imageDetailController);
    
    imageDetailController.$inject = ['$routeParams', '$location', '$modal', 
                                     'imageGalleryData', 'authentication'];
    
    function imageDetailController ($routeParams, $location, $modal, 
                                     imageGalleryData, authentication) {
        var vm = this;
        
        vm.imageid = $routeParams.imageid;
        vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentPath = $location.path();
        
        imageGalleryData
            .getImageById(vm.imageid)
            .success(function(data) {
                vm.data = { image: data }
                if (vm.isLoggedIn) {
                    var creator = vm.data.image.creator;
                    vm.userIsImageCreator =  isImageCreater(creator);
                }
            })
            .error(function(e) {
                console.log(e);
            });
        
        vm.commentModal = function () {
            var modalInstance = $modal.open({
                templateUrl: '/commentModal/commentModal.view.html',
                controller: 'commentModalController as vm',
                resolve: {
                    imageData: function () {
                        return {
                            imageid : vm.imageid,
                            imageTitle : vm.data.image.title
                        };
                    }
                }
            });
            
            modalInstance.result.then(function (newCommentData) {
                vm.data.image.comments.push(newCommentData);
            });
        };
        
        vm.deleteImageModal = function () {
            var modalInstance = $modal.open({
                templateUrl: '/deleteImageModal/deleteImageModal.view.html',
                controller: 'deleteImageModal as vm',
                resolve: {
                    imageData: function () {
                        return {
                            imageid : vm.imageid,
                            imageTitle : vm.data.image.title
                        };
                    }
                }
            });
        };
        
        function isImageCreater(username) {
            return authentication.getCurrentUser().username === username;
        }
    }
    
})();