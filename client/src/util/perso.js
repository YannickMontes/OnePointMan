/*_diffMap(prevMap, nextMap) {
       const prevKeys = _.keys(prevMap);
       const nextKeys = _.keys(nextMap);
       let enter = [];
       let update = [];
       let exit = [];
       prevKeys.forEach(key => {
           const next = nextMap[key];
           if (next) {
               if (!_.isEqual(next, prevMap[key])) {
                   update.push({key: key, value: next});
               }
           } else {
               exit.push({key: key, value: prevMap[key]});
           }
       });
       nextKeys.forEach(key => {
           if (!(key in prevMap)) {
               enter.push({key: key, value: nextMap[key]});
           }
       });
       return {enter: enter, update: update, exit: exit};
   }

   _applySources(prevSources, nextSources) {
   const sourcesDiff = this._diffMap(prevSources, nextSources);
   sourcesDiff.exit.forEach(entry =>  {
       this.props.markers = this.props.markers.filter(item => item.id !== entry.key)
   });
   sourcesDiff.update.forEach(entry => {
   this.props.markers = this.props.markers.filter(item => item.id !== entry.key)
   });
   sourcesDiff.enter.forEach(entry => {
       this.props.markers.push(entry.key, entry.value)
   });

   }


   _indexSources(sources) {
       const indexed = _.keyBy(sources, source => source.id);
       _.values(sources).forEach(source => delete source.id);
       return indexed;
   }*/