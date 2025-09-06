---
title: 基于AOP实现参数校验、登录校验、权限校验
published: 2025-07-01
tags: [Java]
category: Java
draft: true
---

## 📌 学习背景
- 为什么要学？
- 预期目标是什么？
- 预计投入多少时间？

## 🧩 核心概念速记
| 概念 | 一句话解释 | 类比/例子 |
|------|------------|-----------|
|  AOP（面向切面编程）    | 一种编程范式，通过将横切关注点（如日志、事务、权限）从业务逻辑中分离出来，以模块化方式增强代码的可维护性和复用性。           |   像给相机镜头加滤镜，滤镜（切面）可以独立更换，不影响镜头（核心业务）本身，比如给所有方法统一加日志记录，无需改动原方法代码。        |

```bash
interceptorDo()
├─ checkLogin()          →  session 里拿用户，没登录抛 901
├─ checkPermission()     →  对比用户权限列表，没有抛 902
└─ validateParams()      →  遍历方法参数
    ├─ 基本类型  → 直接 checkValue()
    └─ 复杂对象  → 反射取字段 → 再 checkValue()
```

## 🛠️ 动手实践
```bash
# 新建一个切面类，定义切点（注解实现）
    @Aspect
@Component("operationAspect")
public class OperationAspect {

    private final Logger logger = LoggerFactory.getLogger(OperationAspect.class);

    private static final String[] BASE_TYPE_ARRAY = new String[]{"java.lang.String", "java.lang.Integer", "java.lang.Long"};

    @Before("@annotation(com.easyjob.annotation.GlobalInterceptor)")
    public void interceptorDo(JoinPoint point) {
        Object[] arguments = point.getArgs();
        Method method = ((MethodSignature) point.getSignature()).getMethod();
        GlobalInterceptor interceptor = method.getAnnotation(GlobalInterceptor.class);
        if (interceptor == null) {
            return;
        }

        /**
         * 登录校验
         */
        if (interceptor.checkLogin()) {
            checkLogin();
        }

        /**
         * 校验权限
         */
        if (interceptor.permissionCode() != null && interceptor.permissionCode() != PermissionCodeEnum.NO_PERMISSION) {
            checkPermission(interceptor.permissionCode());
        }

        /**
         * 校验参数
         */
        if (interceptor.checkParams()) {
            validateParams(method, arguments);
        }
    }

    void checkLogin() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        SessionUserAdminDto sessionUserAdminDto = (SessionUserAdminDto) request.getSession().getAttribute(Constants.SESSION_KEY);
        if (sessionUserAdminDto == null) {
            throw new BusinessException(ResponseCodeEnum.CODE_901);
        }
    }

    void checkPermission(PermissionCodeEnum permissionCodeEnum) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        SessionUserAdminDto sessionUserAdminDto = (SessionUserAdminDto) request.getSession().getAttribute(Constants.SESSION_KEY);
        List<String> permissionCodeList = sessionUserAdminDto.getPermissionCodeList();
        if (!permissionCodeList.contains(permissionCodeEnum.getCode())) {
            throw new BusinessException(ResponseCodeEnum.CODE_902);
        }
    }

    /**
     * @return
     * @Description 参数校验
     * @Date 2023/9/16 16:51
     * @ClassName
     * @MethodName
     * @Params [method, arguments]
     */
    private void validateParams(Method method, Object[] arguments) {
        Parameter[] parameters = method.getParameters();
        for (int i = 0; i < parameters.length; i++) {
            Parameter parameter = parameters[i];
            Object value = arguments[i];
            VerifyParam verifyParam = parameter.getAnnotation(VerifyParam.class);
            if (verifyParam == null) {
                continue;
            }
            String paramTypeName = parameter.getParameterizedType().getTypeName();
            /**
             * 基本数据类型
             */
            if (ArrayUtils.contains(BASE_TYPE_ARRAY, paramTypeName)) {
                checkValue(value, verifyParam);
            } else {
                checkObjValue(parameter, value);
            }
        }
    }

    private void checkObjValue(Parameter parameter, Object value) {
        try {
            String typeName = parameter.getParameterizedType().getTypeName();
            Class classz = Class.forName(typeName);
            Field[] fields = classz.getDeclaredFields();
            for (Field field : fields) {
                VerifyParam fieldVerifyParam = field.getAnnotation(VerifyParam.class);
                if (fieldVerifyParam == null) {
                    continue;
                }
                field.setAccessible(true);
                Object resultValue = field.get(value);
                checkValue(resultValue, fieldVerifyParam);
            }

        } catch (Exception e) {
            logger.error("校验参数失败", e);
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
    }

    private void checkValue(Object value, VerifyParam verifyParam) {
        Boolean isEmpty = value == null || StringTools.isEmpty(value.toString());
        Integer length = value == null ? 0 : value.toString().length();

        /**
         * 校验空
         */
        if (isEmpty && verifyParam.required()) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
        /**
         * 校验长度
         */
        if (!isEmpty && (verifyParam.max() != -1 && verifyParam.max() < length || verifyParam.min() != -1 && verifyParam.min() > length)) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }

        /**
         * 校验正则
         */
        if (!isEmpty && !StringTools.isEmpty(verifyParam.regex().getRegex()) && !VerifyUtils.verify(verifyParam.regex(), String.valueOf(value))) {
            throw new BusinessException(ResponseCodeEnum.CODE_600);
        }
    }
}
```

```bash
# 创建注释
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface GlobalInterceptor {

    boolean checkLogin() default true;

    PermissionCodeEnum permissionCode() default PermissionCodeEnum.NO_PERMISSION;

    boolean checkParams() default true;
}
```
```bash
Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface VerifyParam {

    /**
     * 校验正则
     *
     * @return
     */
    VerifyRegexEnum regex() default VerifyRegexEnum.NO;

    /**
     * 最小长度
     *
     * @return
     */
    int min() default -1;

    /**
     * 最大长度
     *
     * @return
     */
    int max() default -1;

    boolean required() default false;


}
```