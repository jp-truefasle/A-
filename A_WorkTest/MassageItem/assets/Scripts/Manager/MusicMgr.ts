import Singleton from "../Util/Singleton";

/**
 * 音频管理类
 * 需要在游戏开始之前初始化
 */
export default class MusicMgr extends Singleton {
    //背景音乐
    public bgMusic:cc.AudioClip;
    
    public clickBubbleMusic:cc.AudioClip;

    /**
     * 初始化背景音乐类
     * @param bgMusic 
     */
    public init(bgMusic:cc.AudioClip,clickBubbleMusic:cc.AudioClip){
        this.bgMusic = bgMusic;
        this.clickBubbleMusic = clickBubbleMusic;
        this.playBgMusic();
    }

    /**
     * 播放背景音乐
     */
    public playBgMusic(){
        cc.audioEngine.playMusic(this.bgMusic,true);
    }

    /**
     * 暂停背景音乐播放
     */
    public pauseBgMusic(){
        cc.audioEngine.pauseMusic();
    }

    /**
     * 恢复背景音乐播放
     */
    public resumeMusic(){
        cc.audioEngine.resumeMusic();
    }

    /**
     * 停止背景音乐播放
     */
    public stopBgMusic(){
        cc.audioEngine.stopMusic();
    }

    /**
     * 播放指定音效
     * @param clip 
     */
    public playEffect(clip:cc.AudioClip){
        cc.audioEngine.playEffect(clip,false);
    }

    /**
     * 暂停所有音效
     */
    public pauseAllEffects(){
        cc.audioEngine.pauseAllEffects();
    }

    /**
     * 恢复所有音效
     */
    public resumeAllEffects(){
        cc.audioEngine.resumeAllEffects();
    }
    
    /**
     * 停止所有音效
     */
    public stopAllEffects(){
        cc.audioEngine.stopAllEffects();
    }

}
