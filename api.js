(function (win) {
    // 应用 ID，用来识别应用
    var APP_ID = '在此填入您的应用id';

    // 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
    var APP_KEY = '在此填入你的应用key';

    // 初始化
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY
    });
    /**
     * 更新数据
     * 
     * @param {String} cls 服务端存储类名
     * @param {Syring} id 服务端此条记录的ObjectId
     * @param {Object} data 要存储的数据
     * @returns promise
     */
    function update(cls, id, data) {
        var clsObj = AV.Object.createWithoutData(cls, id);
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                clsObj.set(key, data[key]);
            }
        }
        return clsObj.save().catch(function (error) {
            throw error;
        });
    }
    /**
     * 查询所有数据
     * 
     * @param {String} cls 服务端存储类名
     * @param {Array} sortArr 排序数组性 形如 [{"sort":"asc","field":"groupId"},{"sort":"desc","field":"memberIndex"}]
     * @returns promise
     */
    function findAll(cls, sortArr) {
        var query = new AV.Query(cls);

        query.exists('objectId');

        if (sortArr) {
            if (!(sortArr instanceof Array)) {
                throw new Error('排序参数必须为一个数组，如：[{"sort":"asc","field":"groupId"},{"sort":"desc","field":"memberIndex"}]');
            }
            sortArr.forEach(function (item) {
                var sort = item.sort.toLowerCase();
                if (sort == 'asc') {
                    item.field && query.addAscending(item.field);
                } else if (sort == 'desc') {
                    item.field && query.addDescending(item.field);
                }
            });
        }
        return query.find().catch(function (error) {
            throw error;
        });
    }
    /**
     * 根据指定条件查找
     * 
     * @param {String} cls 服务端存储类名
     * @param {Object/Array} condition 查询条件 一个为对象，多个为数组
     * 每个成员格式为：
     * {
     *     action:'操作名称，可选值为equalTo、notEqualTo、greaterThan、greaterThanOrEqualTo、lessThan、lessThanOrEqualTo',
     *     field:'条件字段名称',
     *     value:'值'
     * }
     * @returns promise
     */
    function findByCondition(cls, condition) {
        var query = new AV.Query(cls);
        if (condition) {
            if (condition instanceof Array) {
                condition.forEach(function (item) {
                    query[item.action](item.field, item.value);
                });
            } else if (typeof condition == 'object') {
                query[item.action](item.field, item.value);
            } else {
                throw new Error('条件参数格式不正确');
            }
        }
        return query.find().catch(function (error) {
            throw error;
        });
    }
    /**
     * 
     * 删除一条记录
     * 
     * @param {String} cls 服务端存储类名
     * @param {Syring} id 服务端此条记录的ObjectId
     * @returns promise
     */
    function deleteItem(cls, id) {
        var clsObj = AV.Object.createWithoutData(cls, id);
        return clsObj.destroy().catch(function (error) {
            throw error;
        });
    }

    win.weekReportAPI = {
        update: update,
        findAll: findAll,
        findByCondition: findByCondition,
        "delete": deleteItem
    };

})(this);