$(function ()
{
    $(document).ready(function ()
    {
        var localStorageName = 'lzx_helper_settings';
        var userId = XF.config.userId;
        var originalUsername = XF.LocalStorage.getJson(localStorageName)['lzx_helper_visitor_username'];
        var forumGroups = {
            'administrator': {
                'username': 'color: #d32020 !important;text-shadow: none',
                'banner': '<em class="userBanner admin"><span class="userBanner-before"></span><strong>Администратор</strong><span class="userBanner-after"></span></em>'
            },
            'expert': {
                'username': 'color: rgb(217, 111, 184) !important;text-shadow: none',
                'banner': '<em class="userBanner expert"><span class="userBanner-before"></span><strong>Эксперт</strong><span class="userBanner-after"></span></em>'
            },
            'sverxrazum': {
                'username': 'color: rgb(199, 89, 139) !important;text-shadow: none',
                'banner': '<em class="userBanner intellekt"><span class="userBanner-before"></span><strong>Сверхразум</strong><span class="userBanner-after"></span></em>'
            },
            'profi': {
                'username': 'color: rgb(66, 99, 121) !important;text-shadow: none',
                'banner': '<em class="userBanner profi"><span class="userBanner-before"></span><strong>Профи</strong><span class="userBanner-after"></span></em>'
            },
            'coder': {
                'username': 'color: #FF9304 !important;text-shadow: none',
                'banner': '<em class="userBanner coder"><span class="userBanner-before"></span><strong>Разработчик</strong><span class="userBanner-after"></span></em>'
            }
        };

        // Import styles
        $('body').append(`<style>.lzx__helper__menu_header h1 {font-size: 18px;text-align: center;}.lzx__helper__menu_header span {font-size: 13px;color: #6f6c6c;}.lzx__helper__menu_header {display: flex;align-items: center;justify-content: center;margin-bottom: 11px;}.lzx__helper__menu_footer {font-weight: 700;font-size: 13px;text-align: center;display: block;margin-top: 11px;}#lzx__helper__user_menu h1 {margin: 0;padding: 0;flex: 1;font-size: 18px;text-align: center;}.lzx__helper__menu_block_container {background: #201e1e;padding: 12px;border-radius: 12px !important;}#lzx__helper__user_menu .overlay-content {padding: 8px;}#lzx__helper_user_menu_close {padding: 5px;background: #9f3434;border-radius: 4px;opacity: 1;}.lzx__helper__menu_footer {font-weight: 700;font-size: 13px;text-align: center;display: block;margin-top: 11px;}#lzx__helper_member_profile_user_id {cursor: pointer;}.lzx__helper_menu_custom_username {margin-top: 16px;}select[name="lzx_helper_custom_banner"] {padding: 5px 21px;}#lzx__helper__open_button {position: fixed;top: 94px;height: fit-content;padding: 11px;background: #1f1f1f;border-top-right-radius: 10px;border-bottom-right-radius: 10px;border: 2px solid #9f3434;border-left: 0;cursor: pointer;width: fit-content;}</style>`);

        if (localStorage.getItem('xf_lzx_helper_settings') === null)
        {
            setupLocalStorage();
        }

        setEnabledFunctions();

        $('#top').prepend(`<div id="lzx__helper__open_button">Helper</div>`);

        $('#lzx__helper__open_button').click(function ()
        {
            // Overlay
            $('body').append(`<div class="overlay-container is-active" id="lzx__helper__user_menu"> <div class="overlay" tabindex="-1" role="dialog" aria-hidden="false"> <div class="overlay-content"> <div class="overlay-content"> <div class="lzx__helper__menu_header lzx__helper__menu_block_container"> <h1>Lozerix Helper. <span>v. 1.3</span> </h1> <a class="overlay-titleCloser" id="lzx__helper_user_menu_close" role="button" tabindex="0" aria-label="Закрыть"></a> </div><div class="lzx__helper__menu_functions lzx__helper__menu_block_container"> <ul class="inputChoices"> <li class="inputChoices-choice"> <label class="iconic"> <input type="checkbox" name="lzx_helper_fairies" value="1"> <i aria-hidden="true"></i> <span class="iconic-label"> Включить феечек <span class="u-muted">(видно только вам)*</span> </span> </label> </li><li class="inputChoices-choice"> <label class="iconic"> <input type="checkbox" name="lzx_helper_user_ids" value="1"> <i aria-hidden="true"></i> <span class="iconic-label"> Отображать айди пользователей в их профиле</span> </label> </li><div class="lzx__helper_menu_custom_username"> <input placeholder="Кастомный юзернейм" class="input" name="lzx_helper_self_username"> </div><div class="lzx__helper_menu_custom_username"> <input placeholder="Кастомный CSS юзернейма" class="input" name="lzx_helper_username_css"> </div><div class="lzx__helper_menu_custom_username"> <select name="lzx_helper_custom_banner"><option value="default">Оставить стандартный</option><option value="administrator">Администратор</option><option value="expert">Эксперт</option><option value="sverxrazum">Сверхразум</option><option value="profi">Профи</option> <option value="coder">Кодер</span> </select> </div></ul> </div><div class="lzx__helper__menu_footer lzx__helper__menu_block_container"> <span class="u-muted">Использование кода в своих проектах ЗАПРЕЩЕНО!</span> </div></div></div></div></div>`);

            // Set active checkboxes
            let localStorageData = XF.LocalStorage.getJson(localStorageName);
            $('#lzx__helper__user_menu input[type="checkbox"]').each(function ()
            {
                let functionName = $(this).attr('name');
                let isChecked = localStorageData[functionName];

                $(this).prop('checked', isChecked);
            });

            // Set custom username
            $('#lzx__helper__user_menu input[name="lzx_helper_self_username"]').val(localStorageData['lzx_helper_self_username']);

            // set custom username css
            $('#lzx__helper__user_menu input[name="lzx_helper_username_css"]').val(localStorageData['lzx_helper_username_css']);

            // Close handler
            $('#lzx__helper_user_menu_close').click(function ()
            {
                $('#lzx__helper__user_menu').remove();
            });

            // Catch change checkbox functions
            $('#lzx__helper__user_menu input[type="checkbox"]').change(function ()
            {
                flashMessage('Изменения сохранены!');

                if ($(this).is(':checked'))
                {
                    let functionName = $(this).attr('name');
                    updateUserMenuValues(functionName, true);
                }
                else
                {
                    let functionName = $(this).attr('name');
                    updateUserMenuValues(functionName, false);
                }
            });

            let delay = 1000;
            let timer = null;

            $('input[name="lzx_helper_self_username"]').keyup(function ()
            {
                clearTimeout(timer);
                if ($(this).val())
                {
                    timer = setTimeout(saveNewUsername, delay);
                }
                else
                {
                    updateUserMenuValues('lzx_helper_self_username', originalUsername);
                }
            });

            function saveNewUsername()
            {
                const newUsername = $('input[name="lzx_helper_self_username"]').val();

                if (newUsername === null)
                {
                    updateUserMenuValues('lzx_helper_self_username', originalUsername);
                }
                else
                {
                    updateUserMenuValues('lzx_helper_self_username', newUsername);
                }

                flashMessage('Никнейм установлен');
            }

            // Set custom css username
            $('input[name="lzx_helper_username_css"]').keyup(function ()
            {
                clearTimeout(timer);
                if ($(this).val())
                {
                    timer = setTimeout(saveCssUsername, delay);
                }
                else
                {
                    updateUserMenuValues('lzx_helper_username_css', null);
                    flashMessage('Кастомные стили на юзернейм были удалены');
                }
            });

            function saveCssUsername()
            {
                const cssUsername = $('input[name="lzx_helper_username_css"]').val();

                if (cssUsername === null)
                {
                    updateUserMenuValues('lzx_helper_username_css', null);
                }
                else
                {
                    updateUserMenuValues('lzx_helper_username_css', cssUsername);
                }

                flashMessage('Кастомные стили на юзернейм установлены');
            }

            // Catch custom groups
            $('#lzx__helper__user_menu select[name="lzx_helper_custom_banner"]').change(function ()
            {
                flashMessage('Изменения сохранены!');
                let valueAttribute = $(this).find('option:selected').attr('value');
                updateUserMenuValues('lzx_helper_custom_banner', valueAttribute);
            });
        });

        function flashMessage(msg)
        {
            return XF.flashMessage('LZX Helper: ' + msg, 3000);
        }

        function setupLocalStorage()
        {
            const username = $('.p-navgroup-link--user .p-navgroup-linkText').text().trim();

            XF.LocalStorage.setJson('lzx_helper_settings', {
                lzx_helper_visitor_username: username,
                lzx_helper_fairies: false,
                lzx_helper_user_ids: true,
                lzx_helper_self_username: null,
                lzx_helper_username_css: null,
                lzx_helper_custom_banner: null
            });
        }

        function updateUserMenuValues(name, value)
        {
            let settings = XF.LocalStorage.getJson(localStorageName);
            settings[name] = value;

            XF.LocalStorage.set(localStorageName, JSON.stringify(settings), true);
            setEnabledFunctions();
        }

        function setUsernameCss(value)
        {
            const elements = $(`.username[data-user-id=${userId}] > span, .p-navgroup-link--user > .p-navgroup-linkText`);
            for (let i = 0; i < elements.length; i++)
            {
                const element = elements[i];
                element.style.cssText = value;
            }
        }

        function setEnabledFunctions()
        {
            let settings = XF.LocalStorage.getJson(localStorageName);

            // fairies
            if (settings['lzx_helper_fairies'])
            {
                $('.username').filter(function ()
                {
                    return ($(this).text().indexOf(settings['lzx_helper_self_username']) > -1);
                }).addClass('fairies_label');
            }
            else
            {
                $('.username').filter(function ()
                {
                    return ($(this).text().indexOf(settings['lzx_helper_self_username']) > -1);
                }).removeClass('fairies_label');
            }

            // id
            if (settings['lzx_helper_user_ids'])
            {
                if ($('body').attr('data-template') === 'member_view')
                {
                    if ($('#lzx__helper_member_profile_user_id').html() === undefined)
                    {
                        $('.memberPairs').append('<dl class="pairs pairs--inline" id="lzx__helper_member_profile_user_id"><dt>User ID</dt><dd>' + userId + '</dd></dl>');

                        $('#lzx__helper_member_profile_user_id').click(function ()
                        {
                            let $tempInput = $('<input>');
                            $('body').append($tempInput);
                            $tempInput.val(userId).select();
                            document.execCommand('copy');
                            $tempInput.remove();

                            flashMessage('ID успешно скопирован');
                        });
                    }
                }
            }
            else
            {
                const userIdPairs = $('#lzx__helper_member_profile_user_id');
                if (userIdPairs)
                {
                    userIdPairs.remove();
                }
            }

            // username
            if (settings['lzx_helper_self_username'] && $('html').attr('data-app') === 'public')
            {
                const newUsername = settings['lzx_helper_self_username'];
                $('body :not(script)').contents().filter(function ()
                {
                    return this.nodeType === 3 && $(this).text().trim() === $('.p-navgroup-link--user .p-navgroup-linkText').text().trim();
                }).each(function ()
                {
                    $(this).replaceWith(newUsername);
                });
            }

            // set css username
            const usernameCss = settings['lzx_helper_username_css'];
            setUsernameCss(usernameCss);

            // set banners
            if (settings['lzx_helper_custom_banner'] && settings['lzx_helper_custom_banner'] !== 'default')
            {
                const banner = forumGroups[settings['lzx_helper_custom_banner']];
                setUsernameCss(banner['username']);

                $('.memberHeader-banners').empty().append(banner['banner']);
            }
        }
    });
});
