<?php
class Ranking
{
    public function Ranking()
    {

    }
	
    public function getTop10($gid)
    {
    	$json = new Services_JSON();
    	$datas = array();
    	$search = "select nickname,total_score,record from sportgame_ranking where gid = $gid ORDER BY  total_score DESC  LIMIT 0 ,10";
    	$rows = $this->get_datas($search);
    	return $json->encode($rows);
    }

    public function UpdateScore($gid, $uid, $nickname, $total, $score)
    {
        return (bool)$this->record($gid, $uid, $nickname, $total, $score);
    }

    public function getRank($gid,$uid,$nickname){
    	$json = new Services_JSON();
    	return $json->encode($this->search($gid, $uid,$nickname, 10, null));
    }
    private function record($gid, $uid, $nickname, $total, $score)
    {
        $result = $this->search($gid, $uid, $nickname, 'COUNT(*)',null);
        if (!$result) {
            return $this->insert($gid, $uid, $nickname, $total, $score);
        } else {
            return $this->update($gid, $uid, $nickname, $total, $score);
        }
    }

    private function search($gid, $uid, $nickname, $range, $setting)
    {
        if (empty($gid)) return false; //(!empty($range)?"total":"*")
        $setting = empty($setting) ? "*" : $setting;
        $sql = "select $setting from sportgame_ranking where gid = $gid";
        if (!empty($uid))
            $sql .= " and uid = $uid";
        if (!empty($nickname))
            $sql .= " and nickname = '$nickname'";
       
        $row = $this->get_data($sql, null);
        if (empty($row)) return false;
        if (!empty($range)) {
            if (is_int($range)) {
            	
                $total = $row['total_score'];
                $range = $range / 2;
                //echo $sql;
                $row = $this->range($gid, $total, $range);
            }
        }
        return $row;
    }

    private function range($gid, $total, $range)
    {
    	if (empty($gid)) return false;
    	$sql = "SELECT count(*) FROM sportgame_ranking WHERE gid =$gid";
    	$count = $this->get_data($sql,'count(*)');
    	$sql = "SELECT count(*) FROM sportgame_ranking WHERE gid =$gid and total_score >= $total";
    	$sub = $this->get_data($sql,'count(*)');
    	//echo "Total = ".$count."  , rank : ".($count-$sub);
    	$result = ($count-$sub-$range)<0;
        $start = $result ?0:($count-$sub-$range);
        $end = $range*2;
        $search = "select nickname,total_score,record from sportgame_ranking where gid = $gid ORDER BY  total_score DESC  LIMIT $start ,$end";
        //echo $search;
        $datas = $this->get_datas($search);
        //$row=array();
        $datas['count']=$count;
        $datas['rank']=$count-$sub;
        //array_push($datas,$row);
        return $datas;
    }

    //insert
    private function insert($gid, $uid, $nickname, $total, $score)
    {
        $sql = "insert into sportgame_ranking (gid, uid, nickname, total_score, score_record, record) values($gid,$uid,'$nickname',$total,'$score',now())";
        return mysql_query($sql);
    }

    private function update($gid, $uid, $nickname, $total, $score)
    {
        $sql = "update sportgame_ranking set total_score = $total,score_record = '$score',record = now(),nickname = '$nickname'  where gid = $gid and uid = $uid";
        return mysql_query($sql);
    }

    //Select
    private function get_data($sql, $keyword)
    {
        $key = mysql_query($sql);
        if ($row = mysql_fetch_assoc($key))
            return (empty($keyword) ? $row : $row[$keyword]);
        else return null;
    }

    private function get_datas($sql)
    {
        $datas = array();
        $key = mysql_query($sql);
        while ($row = mysql_fetch_assoc($key))
            array_push($datas, $row);
        
        if (count($datas) > 0){
        	//print_r($datas);
        	return $datas;
        }
        else return null;
    }
}

?>