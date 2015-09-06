
DROP TABLE IF EXISTS `sport_players_stat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sport_players_stat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `player_guid` varchar(36) NOT NULL,
  `player_description` varchar(255) NOT NULL,
  `game_guid` varchar(36) NOT NULL,
  `game_description` varchar(255) NOT NULL,
  `period` varchar(16) DEFAULT NULL,
  `points` int(11) NOT NULL,
  `fieldgoal_points` int(11) NOT NULL,
  `fieldgoal_three_points` int(11) NOT NULL,
  `fieldgoal_two_points` int(11) NOT NULL,
  `freethrow_points` int(11) NOT NULL,
  `rebound_points` int(11) NOT NULL,
  `assist_points` int(11) NOT NULL,
  `block_points` int(11) NOT NULL,
  `steal_points` int(11) NOT NULL,
  `turnover_points` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `player` (`player_guid`),
  KEY `game` (`game_guid`),
  KEY `period` (`period`)
) ENGINE=InnoDB;
