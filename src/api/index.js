import axios from 'axios'
import iView from 'iview'
import { session } from '@/libs/location'
import { baseUrl } from '@/config/deployUrl'
// 配置API接口地址

const baseURL = baseUrl

// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
      if (o[key].length === 0) {
        delete o[key]
      }
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
      if (o[key].length === 0) {
        delete o[key]
      }
    }
  }
  return o
}

// axios 全局变量 //
// axios.defaults.baseURL = baseUrl
// axios.defaults.timeout = 5000
// axios.defaults.withCredentials = true // 让ajax携带cookie

// 请求拦截器
axios.interceptors.request.use(function (config) {
  let token = session.parseJSON()
  config.headers.common['authorization'] = token === null ? '' : token.authorization
  config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  let status = response.data.status
  let code = response.data.code
  let msg = response.data.message
  if (status === 'success') {
  } else {
    if (code === 10002) {
      // 请求过期时
      if (msg) {
        iView.Modal.warning({
          title: '警告',
          content: '<p>' + msg + '</p><p>请重新登录</p>',
          onOk () {
            // 重新登录
            // router.push({ name: 'home' })
          }
        })
      }
    } else {
      if (msg) {
        iView.Notice.error({
          title: '错误',
          desc: msg
        })
      }
    }
  }
  return response
}, function (error) {
  let errmsg = '网络异常'
  iView.Notice.error({
    title: '错误',
    desc: errmsg
  })
  return Promise.reject(error)
})

export const request = {
  get: function (url, data) {
    if (data) {
      data = filterNull(data)
    }
    let config = {
      baseURL: baseURL,
      method: 'get',
      url: url,
      params: data || {/* get请求参数 */}
    }
    return axios(config)
  },
  post: function (url, data) {
    if (data) {
      data = filterNull(data)
    }
    let config = {
      baseURL: baseURL,
      method: 'post',
      url: url,
      data: data || {/* post请求参数 */}
    }
    return axios(config)
  },
  multipleRequest: function (requests) {
    let reqArray = []
    if (requests.length > 0) {
      for (let req of requests) {
        if (req.method === 'GET') {
          reqArray.push(axios.get(baseURL + req.url, { params: req.data }))
        } else if (req.method === 'POST') {
          reqArray.push(axios.post(baseURL + req.url, req.data))
        }
      }
      return axios.all(reqArray)
    }
  }
}
