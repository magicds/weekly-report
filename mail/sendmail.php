<?php
require_once 'mailer.php';

// 添加附件
// $mailer->addFile('20130VL.jpg');
// 邮件标题
$title = '周报填写提醒';
// 全员提醒内容
$content_all = <<< EOF
<p>您好，今天又是周五啦，请记得填写本周周报：</p>
<p><a href="http://fe.epoint.com.cn:8080/weeklyreport/" target="_black">http://fe.epoint.com.cn:8080/weeklyreport/</a></p>
<p>——来自新点前端周报，预祝您周末愉快！</p>
EOF;

// 未填人员提醒内容
$content_unsubmit = <<< EOF
<p>您好，<span style="color:#f1a325;">今天已经是周六了，您还没填写本周周报</span>，请及时点击下方链接进行填写：</p>
<p><a href="http://fe.epoint.com.cn:8080/weeklyreport/" target="_black">http://fe.epoint.com.cn:8080/weeklyreport/</a></p>
<p>——来自新点前端周报，祝您周末愉快！</p>
EOF;
// 周日警告提醒内容
$content_warning = <<< EOF
<p>您好，<span style="color:#ea644a;">今天已经是周日了，您还没填写本周周报</span>，请点击下方链接进入填写，务必在今天完成填写</p>
<p><a href="http://fe.epoint.com.cn:8080/weeklyreport/" target="_black">http://fe.epoint.com.cn:8080/weeklyreport/</a></p>
<p>再忙也不要忘记填写周报哦！</p>
EOF;

$users = json_decode($_POST['user']);
$type = $_POST['type'];

function sendOneMail($adress, $subject, $content)
{
    $mailer = new Mailer(false);
    if (!$mailer->send($adress, $subject, $content)) {
        echo $mailer->mailer->ErrorInfo;
    }
}

echo '邮件提醒类型：' . $type;
foreach ($users as $key => $value) {
    echo '<br>' . $value->name . ': ' . $value->email;
}

echo '<br> 发送邮件：<br>';
foreach ($users as $key => $user) {
    if ($type == 'all') {
        sendOneMail($user->email, $title, '<p>' . $user->name . '</p>' . $content_all);
    }else if($type == 'unsubmit') {
        sendOneMail($user->email, $title, '<p>' . $user->name . '</p>' . $content_unsubmit);
    }else if($type == 'warning') {
        sendOneMail($user->email, $title, '<p>' . $user->name . '</p>' . $content_warning);
    }
}
