/**
 * @ngdoc directive
 * @name faContainerSurface
 * @module famous.angular
 * @restrict EA
 * @description
 * This directive will create a Famo.us ContainerSurface containing the 
 * specified child elements. The provided `options` object
 * will pass directly through to the Famo.us ContainerSurface's
 * constructor.  See [https://famo.us/docs/0.2.0/surfaces/ContainerSurface/]
 *
 * @usage
 * ```html
 * <fa-container-surface fa-options="scopeOptionsObject">
 *   <!-- zero or more render nodes -->
 * </fa-container-surface>
 * ```
 */

angular.module('famous.angular')
  .directive('faContainerSurface', ["$famous", "$famousDecorator", function ($famous, $famousDecorator) {
    return {
      template: '<div></div>',
      restrict: 'E',
      transclude: true,
      scope: true,
      compile: function(tElem, tAttrs, transclude){
        return  {
          pre: function(scope, element, attrs){
            var isolate = $famousDecorator.ensureIsolate(scope);

            var ContainerSurface = $famous["famous/surfaces/ContainerSurface"];

            var options = scope.$eval(attrs.faOptions) || {};
            isolate.renderNode = new ContainerSurface(options);

            scope.$on('registerChild', function(evt, data){
              if(evt.targetScope.$id != scope.$id){
                isolate.renderNode.add(data.renderNode);
                evt.stopPropagation();
              };
            });

            scope.$on('unregisterChild', function(evt, data){
                //TODO:  support removing children
                throw new Error("unimplemented: fa-container-surface does not support removing children");
            })

          },
          post: function(scope, element, attrs){
            var isolate = $famousDecorator.ensureIsolate(scope);
            
            transclude(scope, function(clone) {
              element.find('div').append(clone);
            });

            scope.$emit('registerChild', isolate);
          }
        };
      }
    };
  }]);
