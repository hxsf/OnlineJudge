require(["jquery", "avalon", "csrfToken", "bsAlert"], function ($, avalon, csrfTokenHeader, bsAlert) {

    avalon.ready(function () {
        if(avalon.vmodels.problemList){
            vm = avalon.vmodels.problemList;
            problemList = [];
        }
        else {
            var vm = avalon.define({
                $id: "problemList",
                problemList: [],
                previousPage: 0,
                nextPage: 0,
                page: 1,
                totalPage: 1,
                keyword: "",
                showVisibleOnly: false,
                getNext: function () {
                    if (!vm.nextPage)
                        return;
                    getPageData(vm.page + 1);
                },
                getPrevious: function () {
                    if (!vm.previousPage)
                        return;
                    getPageData(vm.page - 1);
                },
                getBtnClass: function (btn) {
                    if (btn == "next") {
                        return vm.nextPage ? "btn btn-primary" : "btn btn-primary disabled";
                    }
                    else {
                        return vm.previousPage ? "btn btn-primary" : "btn btn-primary disabled";
                    }
                },
                getPage: function (page_index) {
                    getPageData(page_index);
                },
                showEditProblemPage: function (problemId) {
                    vm.$fire("up!showEditProblemPage", problemId);
                },
                showProblemSubmissionPage: function(problemId){
                    vm.$fire("up!showProblemSubmissionPage", problemId);
                }
            });
            vm.$watch("showVisibleOnly", function () {
                    getPageData(1);
            });
        }
        getPageData(1);
        function getPageData(page) {
            var url = "/api/admin/problem/?paging=true&page=" + page + "&page_size=10";
            if (vm.keyword != "")
                url += "&keyword=" + vm.keyword;
            if (vm.showVisibleOnly)
                url += "&visible=true";
            $.ajax({
                url: url,
                dataType: "json",
                method: "get",
                success: function (data) {
                    if (!data.code) {
                        vm.problemList = data.data.results;
                        vm.totalPage = data.data.total_page;
                        vm.previousPage = data.data.previous_page;
                        vm.nextPage = data.data.next_page;
                        vm.page = page;
                    }
                    else {
                        bsAlert(data.data);
                    }
                }
            });
        }


    });
    avalon.scan();
});
