import request from '../../utils/request';
import PublicService from '../PubliceService';
import config from '../../pages/faceSearch/config';

export default {

  // 获取组件列表
  getList(params) {
    const data = {...params, accessToken: config.accessToken}, encodeData = PublicService.paramSerializer(data);
    return request({
      url: '/faceRetrieve/application/list/page',
      data: encodeData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });
  },
};
