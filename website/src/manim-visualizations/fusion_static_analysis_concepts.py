from manim import *
import networkx as nx

# Colors
DBT_PURPLE = ManimColor.from_hex("#8B5CF6")
BOX_COLOR = DARK_GREY
PENDING_CIRCLE_COLOR = GREY_C
AOT_CIRCLE_COLOR = DBT_PURPLE
JIT_CIRCLE_COLOR = PURE_GREEN
EXECUTE_COLOR = PURE_GREEN

class RectangleVertex(VGroup):
    def __init__(self, label=None, **rect_kwargs):
        # 1) Build and stash the rectangle
        rect = Rectangle(**rect_kwargs)
        self.rect = rect

        # 2) Center the label on top of the rectangle
        if label:
            label.move_to(rect.get_center() + 0.15 * UP)
            super().__init__(rect, label)
        else:
            super().__init__(rect)

        # 3) Add three traffic-light style indicators
        circle_radius = 0.18
        spacing = 0.05
        margin = circle_radius + spacing
        # Lay circles horizontally from the bottom-right corner
        self.indicators = VGroup(*[
            Circle(
                radius=circle_radius,
                fill_color=PENDING_CIRCLE_COLOR,
                fill_opacity=1.0,
                stroke_width=1,
                stroke_color=BOX_COLOR,
            ).move_to(
                rect.get_corner(DR)
                + np.array([
                    -margin - i * (2 * circle_radius + spacing),
                    margin,
                    0
                ])
            )
            for i in reversed(range(3))
        ])
        self.add(self.indicators)

    def get_boundary_point(self, direction):
        """
        Override the boundary point calculation to always use the rectangle's boundary,
        not the VGroup's overall bounding box. This ensures arrows connect to the 
        rectangle edges even when the label spills out.
        """
        # Use the rectangle's center and dimensions instead of the VGroup's
        center = self.rect.get_center()
        w = self.rect.width / 2
        h = self.rect.height / 2
        
        # Calculate which edge the direction vector intersects
        if abs(direction[0]) / w > abs(direction[1]) / h:
            # Intersects left or right edge
            sign = np.sign(direction[0])
            x = center[0] + sign * w
            y = center[1] + direction[1] * (w / abs(direction[0])) if direction[0] != 0 else center[1]
        else:
            # Intersects top or bottom edge
            sign = np.sign(direction[1])
            y = center[1] + sign * h
            x = center[0] + direction[0] * (h / abs(direction[1])) if direction[1] != 0 else center[0]

        return np.array([x, y, center[2]])


class BaseModelDigraph(Scene):
    def __init__(self, vertices, edges, layout, color_sequence, labels=None, **kwargs):
        super().__init__(**kwargs)
        self.vertices = vertices
        self.edges = edges
        self.layout = layout
        self.color_sequence = color_sequence
        
        # Generate labels if not provided
        if labels is None:
            self.labels = {v: Text(v.replace("__", "\n"), font_size=20 if "introspective" in v else 26, font="PT Mono") for v in vertices}
        else:
            self.labels = labels
    
    def center_layout(self, layout):
        """Center a layout dictionary around the origin"""
        positions = list(layout.values())
        
        # Calculate centroid
        centroid_x = sum(pos[0] for pos in positions) / len(positions)
        centroid_y = sum(pos[1] for pos in positions) / len(positions)
        centroid = np.array([centroid_x, centroid_y, 0])
        
        # Adjust all positions by subtracting the centroid
        return {vertex: pos - centroid for vertex, pos in layout.items()}

    def create_animation_for_vertex(self, graph, vertex_name, circle_index, new_color, step_index):
        """Create the pulse and fill animation for a single vertex"""
        vertex = graph.vertices[vertex_name]
        circle = vertex.indicators[circle_index]

        # Create small text with the step number
        step_text = Text(
            str(step_index),
            font_size=16,
            color=BLACK if new_color != DBT_PURPLE else WHITE,
            weight=BOLD
        ).move_to(circle.get_center())
        
        # Make text initially invisible and add it to the vertex group
        step_text.set_opacity(0)
        vertex.add(step_text)

        pulse_and_fill = Succession(
            # Step 1: grow + change color together
            AnimationGroup(
                vertex.animate.scale(1.1),
                lag_ratio=0,    # run both at the same time
            ),
            # Step 2: shrink back, change color, and show text
            AnimationGroup(
                vertex.animate.scale(1),
                circle.animate.set_fill(new_color),
                step_text.animate.set_opacity(1),
                lag_ratio=0,
            ),
            lag_ratio=1,        # only start the shrink once the grow+fill is done
        )
        
        return pulse_and_fill

    def construct(self):
        # Create the directed graph using our custom RectangleVertex
        graph = DiGraph(
            vertices=self.vertices,
            edges=self.edges,
            layout=self.layout,
            vertex_type=RectangleVertex,
            vertex_config={
                "height": 1.5,
                "width": 2.5,
                "fill_color": BOX_COLOR,
                "fill_opacity": 1.0,
                "stroke_color": BOX_COLOR,
                "stroke_width": 2,
            },
            labels=self.labels,
            edge_config={
                "tip_length": 0.2,
                "stroke_width": 2.5,
                "stroke_color": BOX_COLOR,
            },
        )
        
        # Center the graph around the origin
        graph.move_to(ORIGIN)
    
        self.add(graph)

        animation_duration = 0.75  # Duration per animation
        total_animation_time = len(self.color_sequence) * animation_duration
        target_total_time = 20.0  # Target video length in seconds
        
        # Find connected components in the graph
        nx_graph = nx.Graph()  # Use undirected graph for component analysis
        nx_graph.add_nodes_from(self.vertices)
        # Add edges as undirected for component detection
        for edge in self.edges:
            nx_graph.add_edge(edge[0], edge[1])
        
        # Get connected components and create a mapping
        components = list(nx.connected_components(nx_graph))
        vertex_to_component = {}
        for i, component in enumerate(components):
            for vertex in component:
                vertex_to_component[vertex] = i
        
        # Animate each indicator and its rectangle in sequence or parallel
        step_index = 0
        current_component = None
        
        for item in self.color_sequence:
            # Check if this is a parallel animation (list) or sequential (tuple)
            if isinstance(item, list):
                # Parallel animations - all items in the list happen simultaneously
                parallel_animations = []
                
                for vertex_name, circle_index, new_color in item:
                    if new_color is not None:
                        # Reset step_index if we're switching to a different connected component
                        vertex_component = vertex_to_component[vertex_name]
                        if current_component != vertex_component:
                            current_component = vertex_component
                            step_index = 0
                        
                        step_index += 1  # Only increment for actual color changes
                        animation = self.create_animation_for_vertex(graph, vertex_name, circle_index, new_color, step_index)
                        parallel_animations.append(animation)
                
                # Play all parallel animations together
                if parallel_animations:
                    self.play(*parallel_animations, run_time=animation_duration)
                    
            else:
                # Sequential animation (single tuple)
                vertex_name, circle_index, new_color = item
                
                if new_color is None:
                    # Just pause for the animation duration when new_color is None
                    self.wait(animation_duration)
                else:
                    # Reset step_index if we're switching to a different connected component
                    vertex_component = vertex_to_component[vertex_name]
                    if current_component != vertex_component:
                        current_component = vertex_component
                        step_index = 0
                    
                    step_index += 1  # Only increment for actual color changes
                    animation = self.create_animation_for_vertex(graph, vertex_name, circle_index, new_color, step_index)
                    self.play(animation, run_time=animation_duration)
        
        remaining_time = max(0, target_total_time - total_animation_time)
        if remaining_time > 0:
            self.wait(remaining_time)

class FusionJitRunUnsafeComplexDag(BaseModelDigraph):
    def __init__(self, **kwargs):
        vertices = [
            "model_a",
            "model_b",
            "model_x",
            "model_y",
            "introspective__model_c",
            "model_d",
        ]
        edges = [
            ("model_a", "model_b"),
            ("model_b", "model_x"),
            ("model_x", "model_y"),
            ("model_b", "introspective__model_c"),
            ("introspective__model_c", "model_d"),
        ]
        layout = {
            "model_a": 5.5 * LEFT + 1.5 * UP,
            "model_b": 2.5 * LEFT + 1.5 * UP,
            "introspective__model_c": 0.5 * RIGHT + 3 * UP,
            "model_x": 0.5 * RIGHT ,
            "model_d": 3.5 * RIGHT + 3 * UP,
            "model_y": 3.5 * RIGHT,
        }
        color_sequence = [
            ("model_a", 0, AOT_CIRCLE_COLOR),
            ("model_b", 0, AOT_CIRCLE_COLOR),
            [
                ("model_d", 0, AOT_CIRCLE_COLOR),
                ("model_x", 0, AOT_CIRCLE_COLOR)
            ],
            ("model_y", 0, AOT_CIRCLE_COLOR),
            
            ("model_a", 1, AOT_CIRCLE_COLOR),
            ("model_b", 1, AOT_CIRCLE_COLOR),
            ("model_x", 1, AOT_CIRCLE_COLOR),
            ("model_y", 1, AOT_CIRCLE_COLOR),
            
            ("model_a", 2, EXECUTE_COLOR),
            ("model_b", 2, EXECUTE_COLOR),
            
            [
                ("introspective__model_c", 0, JIT_CIRCLE_COLOR),
                ("model_x", 2, EXECUTE_COLOR),
            ],
            [
                ("introspective__model_c", 1, JIT_CIRCLE_COLOR),
                ("model_y", 2, EXECUTE_COLOR),
            ],
            ("introspective__model_c", 2, EXECUTE_COLOR),
            ("model_d", 1, JIT_CIRCLE_COLOR),
            ("model_d", 2, EXECUTE_COLOR),
        ]
        
        # Center the layout around origin
        layout = self.center_layout(layout)
        
        super().__init__(vertices, edges, layout, color_sequence, **kwargs)

class CoreJitRun(BaseModelDigraph):
    def __init__(self, **kwargs):
        vertices = [
            "model_a",
            "model_b",
            "model_c",
            "model_d",
        ]
        edges = [
            ("model_a", "model_b"),
            ("model_b", "model_c"),
            ("model_c", "model_d"),
        ]
        layout = {
            "model_a": 6 * LEFT,
            "model_b": 3 * LEFT,
            "model_c": 0 * LEFT,
            "model_d": 3 * RIGHT,
        }
        color_sequence = [
            # add None for the second circle so that the core and fusion animations end at the same time since they're right beside each other
            ("model_a", 0, JIT_CIRCLE_COLOR),
            ("model_a", 1, None), 
            ("model_a", 2, EXECUTE_COLOR),
            ("model_b", 0, JIT_CIRCLE_COLOR),
            ("model_b", 1, None),
            ("model_b", 2, EXECUTE_COLOR),
            ("model_c", 0, JIT_CIRCLE_COLOR),
            ("model_c", 1, None),
            ("model_c", 2, EXECUTE_COLOR),
            ("model_d", 0, JIT_CIRCLE_COLOR),
            ("model_d", 1, None),
            ("model_d", 2, EXECUTE_COLOR),
        ]
    
        super().__init__(vertices, edges, layout, color_sequence, **kwargs)



class FusionAotRun(BaseModelDigraph):
    def __init__(self, **kwargs):
        vertices = [
            "model_a",
            "model_b",
            "model_c",
            "model_d",
        ]
        edges = [
            ("model_a", "model_b"),
            ("model_b", "model_c"),
            ("model_c", "model_d"),
        ]
        layout = {
            "model_a": 6 * LEFT,
            "model_b": 3 * LEFT,
            "model_c": 0 * LEFT,
            "model_d": 3 * RIGHT,
        }
        color_sequence = [
            ("model_a", 0, AOT_CIRCLE_COLOR),
            ("model_b", 0, AOT_CIRCLE_COLOR),
            ("model_c", 0, AOT_CIRCLE_COLOR),
            ("model_d", 0, AOT_CIRCLE_COLOR),
            ("model_a", 1, AOT_CIRCLE_COLOR),
            ("model_b", 1, AOT_CIRCLE_COLOR),
            ("model_c", 1, AOT_CIRCLE_COLOR),
            ("model_d", 1, AOT_CIRCLE_COLOR),
            ("model_a", 2, EXECUTE_COLOR),
            ("model_b", 2, EXECUTE_COLOR),
            ("model_c", 2, EXECUTE_COLOR),
            ("model_d", 2, EXECUTE_COLOR),
        ]
        
        super().__init__(vertices, edges, layout, color_sequence, **kwargs)



class FusionJitRunUnsafe(BaseModelDigraph):
    def __init__(self, **kwargs):
        vertices = [
            "model_a",
            "model_b",
            "introspective__model_c",
            "model_d",
        ]
        edges = [
            ("model_a", "model_b"),
            ("model_b", "introspective__model_c"),
            ("introspective__model_c", "model_d"),
        ]
        layout = {
            "model_a": 6 * LEFT,
            "model_b": 3 * LEFT,
            "introspective__model_c": 0 * LEFT,
            "model_d": 3 * RIGHT,
        }
        color_sequence = [
            ("model_a", 0, AOT_CIRCLE_COLOR),
            ("model_b", 0, AOT_CIRCLE_COLOR),
            ("model_d", 0, AOT_CIRCLE_COLOR),
            ("model_a", 1, AOT_CIRCLE_COLOR),
            ("model_b", 1, AOT_CIRCLE_COLOR),
            ("model_a", 2, EXECUTE_COLOR),
            ("model_b", 2, EXECUTE_COLOR),
            ("introspective__model_c", 0, JIT_CIRCLE_COLOR),
            ("introspective__model_c", 1, JIT_CIRCLE_COLOR),
            ("introspective__model_c", 2, EXECUTE_COLOR),
            ("model_d", 1, JIT_CIRCLE_COLOR),
            ("model_d", 2, EXECUTE_COLOR),
        ]
        
        super().__init__(vertices, edges, layout, color_sequence, **kwargs)



class FusionJitCompileUnsafe(BaseModelDigraph):
    def __init__(self, **kwargs):
        vertices = [
            "model_a",
            "model_b",
            "introspective__model_c",
            "model_d",
        ]
        edges = [
            ("model_a", "model_b"),
            ("model_b", "introspective__model_c"),
            ("introspective__model_c", "model_d"),
        ]
        layout = {
            "model_a": 6 * LEFT,
            "model_b": 3 * LEFT,
            "introspective__model_c": 0 * LEFT,
            "model_d": 3 * RIGHT,
        }
        color_sequence = [
            ("model_a", 0, AOT_CIRCLE_COLOR),
            ("model_b", 0, AOT_CIRCLE_COLOR),
            ("model_d", 0, AOT_CIRCLE_COLOR),
            ("model_a", 1, AOT_CIRCLE_COLOR),
            ("model_b", 1, AOT_CIRCLE_COLOR),
            ("introspective__model_c", 0, JIT_CIRCLE_COLOR),
            ("introspective__model_c", 1, JIT_CIRCLE_COLOR),
            ("model_d", 1, JIT_CIRCLE_COLOR),
        ]
        
        super().__init__(vertices, edges, layout, color_sequence, **kwargs)




class FusionCoreLifecycleComparisonSingleNode(BaseModelDigraph):
    def __init__(self, **kwargs):
        vertices = [
            "core_model_a",
            "core_model_b",
            "fusion_model_a",
            "fusion_model_b",
        ]
        edges = [
            ("core_model_a", "core_model_b"),
            ("fusion_model_a", "fusion_model_b"),
        ]
        labels = {
            "core_model_a": Text("model_a\n(dbt Core)", font_size=26, font="PT Mono"),
            "core_model_b": Text("model_b\n(dbt Core)", font_size=26, font="PT Mono"),
            "fusion_model_a": Text("model_a\n(Fusion)", font_size=26, font="PT Mono"),
            "fusion_model_b": Text("model_b\n(Fusion)", font_size=26, font="PT Mono"),
        }
        layout = {
            "core_model_a": 4.5 * LEFT,
            "core_model_b": 1.5 * LEFT,
            "fusion_model_a": 1.5 * RIGHT,
            "fusion_model_b": 4.5 * RIGHT,
        }
        color_sequence = [
            ("core_model_a", 0, JIT_CIRCLE_COLOR),
            ("core_model_a", 1, None),
            ("core_model_a", 2, EXECUTE_COLOR),
            ("core_model_b", 0, JIT_CIRCLE_COLOR),
            ("core_model_b", 1, None),
            ("core_model_b", 2, EXECUTE_COLOR),

            ("fusion_model_a", 0, AOT_CIRCLE_COLOR),
            ("fusion_model_b", 0, AOT_CIRCLE_COLOR),
            ("fusion_model_a", 1, AOT_CIRCLE_COLOR),
            ("fusion_model_b", 1, AOT_CIRCLE_COLOR),
            ("fusion_model_a", 2, EXECUTE_COLOR),
            ("fusion_model_b", 2, EXECUTE_COLOR),

        ]
        
        super().__init__(vertices, edges, layout, color_sequence, labels=labels, **kwargs)


